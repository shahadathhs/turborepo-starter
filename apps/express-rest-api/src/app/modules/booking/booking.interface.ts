import mongoose, { Document } from 'mongoose'

export enum BookingStatus {
  PENDING = 'pending', // * tenant requested for booking to landlord (default status)
  APPROVED = 'approved', // * landlord approved tenant request & waiting for tenant to complete payment
  REJECTED = 'rejected', // * landlord rejected tenant request
  CONFIRMED = 'confirmed', // * tenant completed payment
  CANCELLED = 'cancelled', // * tenant did not completed payment & cancelled
}

export type TBookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]

export interface IBooking extends Document {
  listing: mongoose.Types.ObjectId
  tenant: mongoose.Types.ObjectId
  landlord: mongoose.Types.ObjectId
  status: TBookingStatus
  checkInDate: Date
  checkOutDate: Date
  tenantMessage: string
}
