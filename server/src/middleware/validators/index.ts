import { loginValidation } from "@/middleware/validators/auth/login.validator"
import { registerValidation } from "@/middleware/validators/auth/register.validator"
import { oauthValidation } from "@/middleware/validators/auth/oauth.validator"
import {
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
  updateUserProfileValidation,
  updateUserPasswordValidation,
  getUsersValidation,
} from "@/middleware/validators/user"

// Project validators
import {
  createProjectValidation,
  updateProjectValidation,
  createMilestoneValidation,
  updateMilestoneValidation,
  getProjectsValidation,
  assignMembersValidation,
  updateProjectStatusValidation,
} from "@/middleware/validators/project/"

// Task validators
import {
  updateTaskValidation,
  updateTaskStatusValidation,
  updateTaskPriorityValidation,
  assignTaskValidation,
  getTasksValidation,
  validateTaskId,
  createTaskValidation,
} from "@/middleware/validators/task"

// Comment validators
import {
  createCommentValidation,
  updateCommentValidation,
  rejectCommentValidation,
  getCommentsValidation,
  validateCommentId,
} from "@/middleware/validators/comment"

// File validators
import {
  uploadFileValidation,
  uploadFileVersionValidation,
  getFilesValidation,
} from "@/middleware/validators/file"

// Event validators
import {
  createEventValidation,
  updateEventValidation,
  rsvpValidation,
  getEventsValidation,
} from "@/middleware/validators/event"

// Search validators
import {
  searchValidation,
} from "@/middleware/validators/search"

// Resource validators
import {
  createResourceValidation,
  updateResourceValidation,
  getResourcesValidation,
} from "@/middleware/validators/resource"

// Message validators
import {
  sendMessageValidation,
  editMessageValidation,
  getMessagesValidation,
  mongoIdValidator
} from "@/middleware/validators/message"

// Notification validators
import {
  createNotificationValidation,
  getNotificationsValidation,
} from "@/middleware/validators/notification"

import {
  createTagValidation,
  updateTagValidation,
  getTagsValidation,
  getTagByIdValidation
} from "@/middleware/validators/tag"

import {
  awardBadgeValidation,
  awardPointsValidation
} from "@/middleware/validators/gamification"

export default {
  registerValidation,
  loginValidation,
  oauthValidation,
  createUserValidation,
  updateUserValidation,
  updateUserRoleValidation,
  updateUserProfileValidation,
  updateUserPasswordValidation,
  getUsersValidation,

  // Project validators
  createProjectValidation,
  updateProjectValidation,
  createMilestoneValidation,
  updateMilestoneValidation,
  getProjectsValidation,
  assignMembersValidation,
  updateProjectStatusValidation,

  // Task validators
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
  updateTaskPriorityValidation,
  assignTaskValidation,
  getTasksValidation,
  validateTaskId,

  // Comment validators
  createCommentValidation,
  updateCommentValidation,
  rejectCommentValidation,
  getCommentsValidation,
  validateCommentId,

  // File validators
  uploadFileValidation,
  uploadFileVersionValidation,
  getFilesValidation,

  // Event validators
  createEventValidation,
  updateEventValidation,
  rsvpValidation,
  getEventsValidation,

  // Search validators
  searchValidation,

  // Resource validators
  createResourceValidation,
  updateResourceValidation,
  getResourcesValidation,

  // Message validators
  sendMessageValidation,
  editMessageValidation,
  getMessagesValidation,
  mongoIdValidator,

  // Notification validators
  createNotificationValidation,
  getNotificationsValidation,

  // Tag validators
  createTagValidation,
  updateTagValidation,
  getTagsValidation,
  getTagByIdValidation,

  // Gamification validators
  awardPointsValidation,
  awardBadgeValidation
}