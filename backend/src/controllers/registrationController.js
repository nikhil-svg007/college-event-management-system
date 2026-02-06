import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private (student)
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check capacity & deadline
    if (!event.shouldBeOpen()) {
      event.isRegistrationOpen = false;
      await event.save();
      return res.status(400).json({ message: 'Registration is closed for this event' });
    }

    // Ensure not already registered
    const existing = await Registration.findOne({
      user: req.user._id,
      event: event._id
    });
    if (existing) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: event._id
    });

    event.registrationCount += 1;
    event.isRegistrationOpen = event.shouldBeOpen();
    await event.save();

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations for current student
// @route   GET /api/registrations/my
// @access  Private (student)
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id
    })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get students registered for an event (society admin)
// @route   GET /api/registrations/event/:eventId
// @access  Private (society_admin)
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (String(event.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed to view registrations for this event' });
    }

    const registrations = await Registration.find({
      event: event._id
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

