import { Schema, model } from 'mongoose';
import type { HydratedDocument, InferSchemaType } from 'mongoose';

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['meeting', 'workshop', 'hackathon', 'deadline', 'other'],
      required: true,
      index: true
    },
    startAt: {
      type: Date,
      required: true,
      index: true
    },
    endAt: {
      type: Date,
      required: true
    },
    location: String,
    isVirtual: {
      type: Boolean,
      default: false
    },
    meetingLink: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    attendees: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['going', 'maybe', 'not-going', 'pending'],
        default: 'pending'
      },
      respondedAt: Date,
      note: String
    }],
    maxAttendees: Number,
    remindersSent: {
      type: Boolean,
      default: false
    },
    reminders: [{
      sentAt: Date,
      recipientCount: Number
    }],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true
    },
    published: {
      type: Boolean,
      default: true,
      index: true
    },
    attachments: [{
      name: String,
      url: String,
      storageKey: String
    }]
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
EventSchema.index({ startAt: 1, type: 1, status: 1 });
EventSchema.index({ 'attendees.user': 1, 'attendees.status': 1 });
EventSchema.index({ published: 1, status: 1, startAt: 1 });

type EventType = InferSchemaType<typeof EventSchema>;
type EventDocument = HydratedDocument<EventType>;

export { EventDocument, EventType };
export const Event = model<EventType>('Event', EventSchema);
