// import express from 'express';
// import eventController from '@/controllers/event.controller';
// import validators from '@/middleware/validators';
// import { isAuthenticate } from '@/middleware/auth/isAuthenticate';
// import { apiRateLimiters } from '@/middleware/rate-limit';

// const router = express.Router();

// // All event routes require authentication
// router.use(isAuthenticate);

// // POST /events - Create event/meeting
// router.post(
//   '/',
//   validators.createUserValidation, // Using existing validation for now
//   apiRateLimiters.createTask, // Using existing rate limiter
//   eventController.createEvent
// );

// // GET /events - Get all events (with filters: date, type)
// router.get(
//   '/',
//   validators.getUsersValidation, // Using existing validation for now
//   eventController.getEvents
// );

// // GET /events/:id - Get single event details
// router.get(
//   '/:id',
//   eventController.getEventById
// );

// // PUT /events/:id - Update event
// router.put(
//   '/:id',
//   validators.updateUserValidation, // Using existing validation for now
//   eventController.updateEvent
// );

// // DELETE /events/:id - Delete event
// router.delete(
//   '/:id',
//   eventController.deleteEvent
// );

// // POST /events/:id/rsvp - RSVP to event
// router.post(
//   '/:id/rsvp',
//   validators.createUserValidation, // Using existing validation for now
//   eventController.rsvpToEvent
// );

// // GET /events/:id/attendees - Get event attendees
// router.get(
//   '/:id/attendees',
//   eventController.getEventAttendees
// );

// // DELETE /events/:id/rsvp - Cancel RSVP
// router.delete(
//   '/:id/rsvp',
//   eventController.cancelRsvp
// );

// // GET /events/calendar - Get calendar view of events
// router.get(
//   '/calendar',
//   eventController.getCalendarView
// );

// // GET /events/upcoming - Get upcoming events
// router.get(
//   '/upcoming',
//   eventController.getUpcomingEvents
// );

// export default router;
