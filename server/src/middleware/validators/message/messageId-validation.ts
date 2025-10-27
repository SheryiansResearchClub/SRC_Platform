import { param } from 'express-validator';
import mongoose from 'mongoose';

export const mongoIdValidator = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid MongoID')
];