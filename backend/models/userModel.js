import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import { passWordValidator } from '../validator/customValidator.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Please provide a username'],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Please provide an email'],
      lowercase: true,
      validate: [isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please provide an password'],
      minlength: [6, 'Password requires at least 6 characters'],
      validate: [passWordValidator, 'Password must contain at least one number and one uppercase letter'],
    },
    totalShippingAddressCount: {
      type: Number,
      default: 0,
    },
    totalOrderCount: {
      type: Number,
      default: 0,
    },
    isVendor: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('users', userSchema);

export default UserModel;
