import { asyncHandler } from 'app/utils/asyncHandler'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import sendResponse from 'app/utils/sendResponse'
import { NextFunction, Request, Response } from 'express'

import { BookingService } from './booking.service'

// * Create a new booking (Tenant only)
const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  // * Attach logged-in user ID as the tenant to the booking
  const bookingPayload = {
    ...req.body,
    tenant: req.user.userId,
  }
  const result = await BookingService.createBooking(bookingPayload)
  sendResponse(res, {
    statusCode: httpStatusCode.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: result,
  })
  next()
}

// * Get all bookings (Admin only)
const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  const queryOptions = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    status: req.query.status as string | undefined,
  }
  const result = await BookingService.getAllBookings(queryOptions)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
  next()
}

// * Get all bookings for a tenant (Tenant only)
const getAllBookingsForTenant = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user
  const result = await BookingService.getAllBookingsForTenant(userId)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
  next()
}

// * Get all bookings for a landlord (Landlord only)
const getAllBookingsForLandlord = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.user
  const result = await BookingService.getAllBookingsForLandlord(userId)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
  next()
}

// * Get booking details (Accessible to admin and tenant & landlord of the that booking)
const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await BookingService.getBookingById(id)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Booking details retrieved successfully',
    data: result,
  })
  next()
}

// * Update booking status (Landlord (the landlord of the listing) only)
const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const { status } = req.body
  const result = await BookingService.updateBookingStatus(id, { status })
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Booking status updated successfully',
    data: result,
  })
  next()
}

// * Delete booking (Admin only)
const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await BookingService.deleteBooking(id)
  sendResponse(res, {
    statusCode: httpStatusCode.OK,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  })
  next()
}

export const BookingController = {
  createBooking: asyncHandler(createBooking),
  getAllBookings: asyncHandler(getAllBookings),
  getAllBookingsForTenant: asyncHandler(getAllBookingsForTenant),
  getAllBookingsForLandlord: asyncHandler(getAllBookingsForLandlord),
  getBookingById: asyncHandler(getBookingById),
  updateBookingStatus: asyncHandler(updateBookingStatus),
  deleteBooking: asyncHandler(deleteBooking),
}
