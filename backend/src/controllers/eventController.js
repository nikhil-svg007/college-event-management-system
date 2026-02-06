import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Society from '../models/Society.js';

// @desc    Create event (society admin)
// @route   POST /api/events
// @access  Private (society_admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      dateTime,
      venue,
      onlineLink,
      maxParticipants,
      registrationDeadline
    } = req.body;

    const societyId = req.user.society;
    if (!societyId) {
      return res.status(400).json({ message: 'Society not linked to this admin' });
    }

    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(400).json({ message: 'Society not found' });
    }

    const eventData = {
      title,
      description,
      category,
      dateTime,
      venue,
      onlineLink,
      maxParticipants,
      registrationDeadline,
      society: societyId,
      createdBy: req.user._id
    };

    if (req.file) {
      eventData.posterUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create(eventData);

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const now = new Date();
    const { category } = req.query;

    const query = { dateTime: { $gte: now } };
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate('society', 'name')
      .sort({ dateTime: 1 });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('society', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event (society admin, owner)
// @route   PUT /api/events/:id
// @access  Private (society_admin)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed to update this event' });
    }

    const updatableFields = [
      'title',
      'description',
      'category',
      'dateTime',
      'venue',
      'onlineLink',
      'maxParticipants',
      'registrationDeadline'
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    if (req.file) {
      event.posterUrl = `/uploads/${req.file.filename}`;
    }

    // Recompute registration status if capacity or deadline changed
    event.isRegistrationOpen = event.shouldBeOpen();

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event (society admin, owner)
// @route   DELETE /api/events/:id
// @access  Private (society_admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed to delete this event' });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({ message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};
