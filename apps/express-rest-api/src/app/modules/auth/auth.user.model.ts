import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import { UserRole } from 'app/utils/enum/userRole'
import bcrypt from 'bcryptjs'
import mongoose, { Model, Schema } from 'mongoose'

import { IUser } from './auth.user.interface'

// * User Schema
const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude password field when querying by default
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.TENANT,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// * Pre-save middleware to validate unique email
UserSchema.pre<IUser>('save', async function (next) {
  // Check for duplicate email only when creating a new user
  if (this.isNew) {
    const existingUser = await User.findOne({ email: this.email })
    // * if existing user isDeleted, update isDeleted to false
    if (existingUser && existingUser.isDeleted) {
      existingUser.isDeleted = false
      await existingUser.save()
    }
    if (existingUser) {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'Email already exists')
    }
  }
  next()
})

// * Pre-save middleware to validate unique phone number
UserSchema.pre<IUser>('save', async function (next) {
  // Check for duplicate phone number only when creating a new user
  if (this.isNew) {
    const existingUser = await User.findOne({ phone: this.phone })
    if (existingUser) {
      throw new AppError(httpStatusCode.BAD_REQUEST, 'Phone number already exists')
    }
  }
  next()
})

// * Pre-save middleware to hash the password if modified or new
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// * Instance method to compare an entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

// * Instance method to update the user's password
UserSchema.methods.updatePassword = async function (newPassword: string): Promise<void> {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(newPassword, salt)
  await this.save()
}

// * Instance method to get user profile (without sensitive data)
UserSchema.methods.toProfileJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

// * Instance method to check if the user is an admin
UserSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin'
}

// * Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)
export default User
