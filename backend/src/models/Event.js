import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    category: {
      type: String,
      enum: ['Dance', 'Singing', 'Seminar', 'Tech', 'Sports', 'Other'],
      required: [true, 'Category is required']
    },
    society: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, //createdBy will store the _id of another document
      ref: 'User',  //This ObjectId belongs to a document in the User collection
      required: true
    },
    dateTime: {
      type: Date,
      required: [true, 'Event date & time is required']
    },
    venue: {
      type: String,
      trim: true
    },
    onlineLink: {
      type: String,
      trim: true
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'Max participants must be at least 1']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required']
    },
    registrationCount: {
      type: Number,
      default: 0
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true
    },
    posterUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Add an instance method to the Event schema
eventSchema.methods.shouldBeOpen = function () {
  const now = new Date();
  const underCapacity = this.registrationCount < this.maxParticipants;// Check if event has not reached max participants
  const beforeDeadline = now <= this.registrationDeadline;// Check if current time is before registration deadline
  return underCapacity && beforeDeadline; // Registration is open only if both conditions are true
};

const Event = mongoose.model('Event', eventSchema);
export default Event;

