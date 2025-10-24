// import { Event, EventDocument, EventType } from '../models/event.model';

// class EventRepository {
//   async create(eventData: {
//     title: string;
//     description: string;
//     type: 'meeting' | 'workshop' | 'hackathon' | 'deadline' | 'other';
//     startAt: Date;
//     endAt: Date;
//     location?: string;
//     isVirtual?: boolean;
//     meetingLink?: string;
//     createdBy: string;
//     attendees?: Array<{
//       user: string;
//       status?: 'going' | 'maybe' | 'not-going' | 'pending';
//       respondedAt?: Date;
//       note?: string;
//     }>;
//     maxAttendees?: number;
//     status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//     published?: boolean;
//     attachments?: Array<{
//       name?: string;
//       url?: string;
//       storageKey?: string;
//     }>;
//   }): Promise<EventDocument> {
//     const event = await Event.create(eventData);
//     return event as EventDocument;
//   }

//   async findById(eventId: string): Promise<EventDocument | null> {
//     return await Event.findById(eventId)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .exec() as EventDocument | null;
//   }

//   async findAll(options: {
//     type?: string;
//     status?: string;
//     published?: boolean;
//     startDate?: Date;
//     endDate?: Date;
//     createdBy?: string;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<EventDocument[]> {
//     const {
//       type,
//       status,
//       published = true,
//       startDate,
//       endDate,
//       createdBy,
//       page = 1,
//       limit = 20,
//       sort = 'startAt'
//     } = options;

//     const query: any = {};

//     if (type) query.type = type;
//     if (status) query.status = status;
//     if (published !== undefined) query.published = published;
//     if (createdBy) query.createdBy = createdBy;

//     // Date range filtering
//     if (startDate || endDate) {
//       query.startAt = {};
//       if (startDate) query.startAt.$gte = startDate;
//       if (endDate) query.startAt.$lte = endDate;
//     }

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async findUpcoming(options: {
//     limit?: number;
//     userId?: string;
//     type?: string;
//   } = {}): Promise<EventDocument[]> {
//     const { limit = 10, userId, type } = options;
//     const query: any = {
//       startAt: { $gt: new Date() },
//       status: { $in: ['upcoming', 'ongoing'] },
//       published: true
//     };

//     if (type) query.type = type;

//     // If userId provided, exclude events where user already responded
//     if (userId) {
//       const userEvents = await this.findByAttendee(userId, { limit: 1000 });
//       const userEventIds = userEvents.map(event => event._id);
//       if (userEventIds.length > 0) {
//         query._id = { $nin: userEventIds };
//       }
//     }

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async findByDateRange(startDate: Date, endDate: Date, options: {
//     type?: string;
//     status?: string;
//     userId?: string;
//     published?: boolean;
//   } = {}): Promise<EventDocument[]> {
//     const { type, status, userId, published = true } = options;
//     const query: any = {
//       startAt: { $gte: startDate, $lte: endDate },
//       published
//     };

//     if (type) query.type = type;
//     if (status) query.status = status;

//     let events = await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .exec() as EventDocument[];

//     // Filter by attendee if specified
//     if (userId) {
//       events = events.filter(event =>
//         event.attendees.some(attendee => attendee.user._id.toString() === userId)
//       );
//     }

//     return events;
//   }

//   async findByAttendee(userId: string, options: {
//     status?: string;
//     startDate?: Date;
//     endDate?: Date;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<EventDocument[]> {
//     const { status, startDate, endDate, page = 1, limit = 20 } = options;

//     // Find events where user is an attendee
//     const events = await Event.find({
//       'attendees.user': userId as any
//     })
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort({ startAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];

//     return events.filter(event => {
//       const attendee = event.attendees.find((a: any) => a.user._id.toString() === userId);
//       if (status && attendee) {
//         return attendee.status === status;
//       }
//       return true;
//     });
//   }

//   async findByCreator(userId: string, options: {
//     status?: string;
//     published?: boolean;
//     page?: number;
//     limit?: number;
//     sort?: string;
//   } = {}): Promise<EventDocument[]> {
//     const { status, published, page = 1, limit = 20, sort = '-createdAt' } = options;
//     const query: any = { createdBy: userId };

//     if (status) query.status = status;
//     if (published !== undefined) query.published = published;

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort(sort)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async update(eventId: string, updateData: Partial<EventType>): Promise<EventDocument | null> {
//     return await Event.findByIdAndUpdate(eventId, updateData, { new: true })
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .exec() as EventDocument | null;
//   }

//   async delete(eventId: string): Promise<void> {
//     await Event.findByIdAndDelete(eventId);
//   }

//   async rsvp(eventId: string, userId: string, rsvpData: {
//     status: 'going' | 'maybe' | 'not-going' | 'pending';
//     note?: string;
//   }): Promise<EventDocument | null> {
//     // Use atomic update operations to avoid DocumentArray type issues
//     const updatedEvent = await Event.findByIdAndUpdate(
//       eventId,
//       {
//         // Remove attendee entry
//         $pull: {
//           attendees: { user: userId }
//         },
//         // Add new RSVP
//         $push: {
//           attendees: {
//             user: userId,
//             status: rsvpData.status,
//             respondedAt: new Date(),
//             note: rsvpData.note
//           }
//         }
//       },
//       { new: true }
//     )
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .exec() as EventDocument | null;

//     return updatedEvent;
//   }

//   async cancelRsvp(eventId: string, userId: string): Promise<EventDocument | null> {
//     // Use atomic update operations to avoid DocumentArray type issues
//     const updatedEvent = await Event.findByIdAndUpdate(
//       eventId,
//       {
//         // Remove attendee entry
//         $pull: {
//           attendees: { user: userId }
//         }
//       },
//       { new: true }
//     )
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .exec() as EventDocument | null;

//     return updatedEvent;
//   }

//   async updateEventStatus(eventId: string, status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'): Promise<EventDocument | null> {
//     return await Event.findByIdAndUpdate(
//       eventId,
//       { status },
//       { new: true }
//     )
//       .populate('createdBy', 'name email avatarUrl')
//       .exec() as EventDocument | null;
//   }

//   async addReminder(eventId: string, reminderData: {
//     sentAt: Date;
//     recipientCount: number;
//   }): Promise<EventDocument | null> {
//     return await Event.findByIdAndUpdate(
//       eventId,
//       {
//         $push: { reminders: reminderData },
//         remindersSent: true
//       },
//       { new: true }
//     ) as EventDocument | null;
//   }

//   async getAttendees(eventId: string): Promise<EventDocument['attendees'] | []> {
//     const event = await Event.findById(eventId)
//       .populate('attendees.user', 'name email avatarUrl')
//       .exec();

//     return event ? event.attendees : [];
//   }

//   async countAttendees(eventId: string, status?: string): Promise<number> {
//     const event = await Event.findById(eventId).exec();
//     if (!event) return 0;

//     if (status) {
//       return event.attendees.filter(attendee => attendee.status === status).length;
//     }

//     return event.attendees.length;
//   }

//   async findByType(type: string, options: {
//     status?: string;
//     published?: boolean;
//     startDate?: Date;
//     endDate?: Date;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<EventDocument[]> {
//     const { status, published = true, startDate, endDate, page = 1, limit = 20 } = options;
//     const query: any = { type, published };

//     if (status) query.status = status;

//     // Date range filtering
//     if (startDate || endDate) {
//       query.startAt = {};
//       if (startDate) query.startAt.$gte = startDate;
//       if (endDate) query.startAt.$lte = endDate;
//     }

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async findVirtualEvents(options: {
//     limit?: number;
//     upcoming?: boolean;
//   } = {}): Promise<EventDocument[]> {
//     const { limit = 20, upcoming = true } = options;
//     const query: any = { isVirtual: true, published: true };

//     if (upcoming) {
//       query.startAt = { $gt: new Date() };
//       query.status = { $in: ['upcoming', 'ongoing'] };
//     }

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async findByLocation(location: string, options: {
//     upcoming?: boolean;
//     limit?: number;
//   } = {}): Promise<EventDocument[]> {
//     const { upcoming = true, limit = 20 } = options;
//     const query: any = { location: { $regex: location, $options: 'i' }, published: true };

//     if (upcoming) {
//       query.startAt = { $gt: new Date() };
//       query.status = { $in: ['upcoming', 'ongoing'] };
//     }

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async searchEvents(query: string, options: {
//     type?: string;
//     status?: string;
//     location?: string;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<EventDocument[]> {
//     const { type, status, location, page = 1, limit = 20 } = options;
//     const searchQuery: any = {
//       $or: [
//         { title: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } }
//       ],
//       published: true
//     };

//     if (type) searchQuery.type = type;
//     if (status) searchQuery.status = status;
//     if (location) searchQuery.location = { $regex: location, $options: 'i' };

//     return await Event.find(searchQuery)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async getCalendarEvents(startDate: Date, endDate: Date, options: {
//     userId?: string;
//     type?: string;
//   } = {}): Promise<EventDocument[]> {
//     const { userId, type } = options;
//     const query: any = {
//       startAt: { $gte: startDate, $lte: endDate },
//       published: true
//     };

//     if (type) query.type = type;

//     let events = await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .sort({ startAt: 1 })
//       .exec() as EventDocument[];

//     // Filter by attendee if userId provided
//     if (userId) {
//       events = events.filter(event =>
//         event.attendees.some(attendee => attendee.user._id.toString() === userId)
//       );
//     }

//     return events;
//   }

//   async countByType(type: string): Promise<number> {
//     return await Event.countDocuments({ type, published: true });
//   }

//   async countByStatus(status: string): Promise<number> {
//     return await Event.countDocuments({ status });
//   }

//   async getEventsByUser(userId: string, options: {
//     role?: 'creator' | 'attendee' | 'both';
//     status?: string;
//     type?: string;
//     page?: number;
//     limit?: number;
//   } = {}): Promise<EventDocument[]> {
//     const { role = 'both', status, type, page = 1, limit = 20 } = options;
//     const query: any = {};

//     if (role === 'creator') {
//       query.createdBy = userId;
//     } else if (role === 'attendee') {
//       query['attendees.user'] = userId as any;
//     } else {
//       query.$or = [
//         { createdBy: userId },
//         { 'attendees.user': userId as any }
//       ];
//     }

//     if (status) query.status = status;
//     if (type) query.type = type;

//     return await Event.find(query)
//       .populate('createdBy', 'name email avatarUrl')
//       .populate('attendees.user', 'name email avatarUrl')
//       .sort({ startAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec() as EventDocument[];
//   }

//   async getEventStats(): Promise<{
//     total: number;
//     upcoming: number;
//     ongoing: number;
//     completed: number;
//     cancelled: number;
//     byType: Record<string, number>;
//   }> {
//     const [total, upcoming, ongoing, completed, cancelled, byType] = await Promise.all([
//       Event.countDocuments({ published: true }),
//       Event.countDocuments({ status: 'upcoming', published: true }),
//       Event.countDocuments({ status: 'ongoing', published: true }),
//       Event.countDocuments({ status: 'completed', published: true }),
//       Event.countDocuments({ status: 'cancelled', published: true }),
//       this.getCountByType()
//     ]);

//     return {
//       total,
//       upcoming,
//       ongoing,
//       completed,
//       cancelled,
//       byType
//     };
//   }

//   private async getCountByType(): Promise<Record<string, number>> {
//     const results = await Event.aggregate([
//       { $match: { published: true } },
//       { $group: { _id: '$type', count: { $sum: 1 } } }
//     ]);

//     const byType: Record<string, number> = {};
//     results.forEach(result => {
//       byType[result._id] = result.count;
//     });

//     return byType;
//   }
// }

// export const eventRepo = new EventRepository();
