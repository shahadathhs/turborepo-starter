import AppError from 'app/errors/functions/AppError'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import mongoose from 'mongoose'

import { IBooking } from './booking.interface'
import Booking from './booking.model'
import { TGetBookings, TQueryOptions } from './booking.utils'

// * Create a new booking
const createBooking = async (payload: Partial<IBooking>): Promise<IBooking> => {
  const booking = (await Booking.create(payload)).populate('listing landlord tenant')
  return booking
}

// * Retrieve bookings with optional filters and pagination
const getAllBookings = async (queryOptions: TQueryOptions = {}): Promise<TGetBookings> => {
  const { page = 1, limit = 10, status } = queryOptions
  const filter: { status?: string } = {}

  // * Filter by status if provided
  if (status) {
    filter.status = status
  }

  // * Calculate skip value for pagination
  const skip = (page - 1) * limit

  // * Fetch bookings with pagination
  const bookings = await Booking.find(filter).skip(skip).limit(limit)
  const populatedData = await Booking.populate(bookings, {
    path: 'listing landlord tenant',
    select: '-password',
  })
  // * Count total matching bookings
  const total = await Booking.countDocuments(filter)

  return {
    bookings: populatedData,
    metadata: {
      total,
      page,
      limit,
    },
  }
}

// * Get all bookings for a tenant
const getAllBookingsForTenant = async (tenantId: string): Promise<IBooking[]> => {
  // Validate the tenantId is a valid ObjectId string
  if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Invalid tenantId')
  }
  // Convert the tenantId string to an ObjectId
  const objectId = new mongoose.Types.ObjectId(tenantId)

  const bookings: IBooking[] = await Booking.find({ tenant: objectId })
  const populatedData = await Booking.populate(bookings, {
    path: 'listing landlord tenant',
    select: '-password',
  })
  return populatedData
}

// * Get all bookings for a landlord
const getAllBookingsForLandlord = async (landlordId: string): Promise<IBooking[]> => {
  // Validate the landlordId is a valid ObjectId string
  if (!mongoose.Types.ObjectId.isValid(landlordId)) {
    throw new AppError(httpStatusCode.BAD_REQUEST, 'Invalid landlordId')
  }
  // Convert the landlordId string to an ObjectId
  const objectId = new mongoose.Types.ObjectId(landlordId)
  // Fetch bookings for the landlord
  const bookings = await Booking.find({ landlord: objectId })

  // Populate the 'listing', 'landlord', and 'tenant' fields
  const populatedData = await Booking.populate(bookings, {
    path: 'listing landlord tenant',
    select: '-password',
  })
  return populatedData
}

// * Get booking details by ID
const getBookingById = async (id: string): Promise<IBooking> => {
  const booking = await Booking.findById(id).populate('listing landlord tenant')
  if (!booking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return booking
}

// * Update booking status
const updateBookingStatus = async (
  id: string,
  payload: { status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'rejected' },
): Promise<IBooking> => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, payload, { new: true }).populate(
    'listing landlord tenant',
  )
  if (!updatedBooking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return updatedBooking
}

// * Delete booking
const deleteBooking = async (id: string): Promise<IBooking> => {
  const deletedBooking = await Booking.findByIdAndDelete(id)
  if (!deletedBooking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return deletedBooking
}

export const BookingService = {
  createBooking,
  getAllBookings,
  getAllBookingsForTenant,
  getAllBookingsForLandlord,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
}
