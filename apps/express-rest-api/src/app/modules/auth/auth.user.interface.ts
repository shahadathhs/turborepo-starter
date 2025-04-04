import { UserRole } from 'app/utils/enum/userRole'
import mongoose, { Document } from 'mongoose'

// TRole is now derived from the UserRole enum values
export type TRole = (typeof UserRole)[keyof typeof UserRole]

export type TJwtPayload = {
  email: string
  userId: mongoose.Types.ObjectId
  role: TRole
}

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  password: string
  role: TRole
  isActive: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  matchPassword(enteredPassword: string): Promise<boolean>
  updatePassword(newPassword: string): Promise<void>
  toProfileJSON(): {
    id: string
    name: string
    email: string
    phone: string
    role: TRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }
  isAdmin(): boolean
}
