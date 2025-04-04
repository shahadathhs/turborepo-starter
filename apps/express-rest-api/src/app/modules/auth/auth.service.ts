import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import { IUser, TJwtPayload, TRole } from './auth.user.interface'
import User from './auth.user.model'
import { createToken } from './auth.utils'

// * Register a new user
const registerUser = async (payload: Partial<IUser>): Promise<Partial<IUser>> => {
  const user = await User.create(payload)
  const userWithoutPassword = { ...user.toJSON(), password: undefined }
  return userWithoutPassword
}

// * Login an existing user
const loginUser = async (payload: {
  email: string
  password: string
}): Promise<{ token: string; user: Partial<IUser> }> => {
  const { email, password } = payload

  // * Try to get user data with password by email
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  if (user.isActive === false) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'Your account is deactivated')
  }

  // * Compare password
  const isPasswordMatched = await user.matchPassword(password)
  if (!isPasswordMatched) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid credentials')
  }

  // * Generate token payload
  const jwtPayload: TJwtPayload = {
    email: user.email,
    userId: user._id as mongoose.Types.ObjectId,
    role: user.role,
  }

  // * Generate token
  const token = createToken(jwtPayload)

  return {
    token,
    user: {
      phone: user.phone,
      email: user.email,
      name: user.name,
      role: user.role,
      _id: user._id,
    },
  }
}

// * Update user profile (Accessible to Landlords and Tenants)
const updateProfile = async (id: string, payload: Partial<IUser>): Promise<Partial<IUser>> => {
  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return {
    phone: updatedUser.phone,
    email: updatedUser.email,
    name: updatedUser.name,
    role: updatedUser.role,
    _id: updatedUser._id,
  }
}

// * Update user password (Accessible to Landlords and Tenants)
const updatePassword = async (
  id: string,
  payload: { currentPassword: string; newPassword: string },
): Promise<IUser> => {
  const { currentPassword, newPassword } = payload
  const user = await User.findById(id).select('+password')
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }

  // * Verify current password
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)
  if (!isPasswordMatched) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid credentials')
  }

  // * Hash new password and update
  const salt = await bcrypt.genSalt(10)
  const updatedPassword = await bcrypt.hash(newPassword, salt)
  await User.findByIdAndUpdate(id, { password: updatedPassword }, { new: true })

  // * Fetch the updated user and verify new password
  const updatedUser = await User.findById(id).select('+password')
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  const passwordMatch = await updatedUser.matchPassword(newPassword)
  if (!passwordMatch) {
    throw new AppError(httpStatusCode.INTERNAL_SERVER_ERROR, 'Password update failed')
  }
  return updatedUser
}

// * Update user delete status (Accessible to Landlords and Tenants)
// Note: This function deactivates a user by setting isActive to false.
const updateDeletedStatus = async (id: string): Promise<IUser> => {
  const updatedUser = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

// * Retrieve all users (Admin only) with pagination and optional email filtering
const getAllUsers = async (
  queryOptions: { email?: string; page?: number; limit?: number } = {},
): Promise<{ users: IUser[]; metadata: { total: number; page: number; limit: number } }> => {
  const { email, page = 1, limit = 10 } = queryOptions
  const filter: { email?: { $regex: string; $options: string } } = {}

  // * If email is provided, search using case-insensitive regex.
  if (email) {
    filter.email = { $regex: email, $options: 'i' }
  }

  // * Calculate how many documents to skip.
  const skip = (page - 1) * limit

  // * Fetch the users with pagination.
  const users = await User.find(filter).skip(skip).limit(limit)
  // * Get the total count of users matching the filter.
  const total = await User.countDocuments(filter)

  return {
    users,
    metadata: {
      total,
      page,
      limit,
    },
  }
}

// * Update user role (Admin only)
// Updated to accept a new role in the payload
const updateRole = async (id: string, payload: { role: TRole }): Promise<IUser> => {
  const updatedUser = await User.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

// * Update user active status (Admin only) by toggling isActive
const updateActiveStatus = async (id: string): Promise<IUser> => {
  const user = await User.findById(id)
  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  const updatedUser = await User.findByIdAndUpdate(id, { isActive: !user.isActive }, { new: true })
  if (!updatedUser) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'User not found')
  }
  return updatedUser
}

export const AuthService = {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
  updateDeletedStatus,
  getAllUsers,
  updateRole,
  updateActiveStatus,
}
