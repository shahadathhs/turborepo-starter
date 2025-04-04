import Authentication from 'app/middlewares/authentication'
import validateRequest from 'app/middlewares/validateRequest'
import { UserRole } from 'app/utils/enum/userRole'
import { Router } from 'express'

import { BookingController } from './booking.controller'
import { BookingValidation } from './booking.validation'

const router = Router()

// * Create booking (Tenant only)
router.post(
  '/',
  Authentication(UserRole.TENANT),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking,
)

// * Get all bookings (Admin only)
router.get('/', Authentication(UserRole.ADMIN), BookingController.getAllBookings)

// * Get all bookings for a tenant (Tenant only)
router.get('/tenant', Authentication(UserRole.TENANT), BookingController.getAllBookingsForTenant)

// * Get all bookings for a landlord (Landlord only)
router.get(
  '/landlord',
  Authentication(UserRole.LANDLORD),
  BookingController.getAllBookingsForLandlord,
)

// * Get booking details (Accessible to admin and tenant & landlord of the that booking)
router.get(
  '/:id',
  Authentication(UserRole.ADMIN, UserRole.TENANT, UserRole.LANDLORD),
  BookingController.getBookingById,
)

// * Update booking status (Landlord & Tenant (the landlord of the listing) only)
router.patch(
  '/:id/status',
  Authentication(UserRole.LANDLORD, UserRole.TENANT),
  validateRequest(BookingValidation.updateBookingSchema),
  BookingController.updateBookingStatus,
)

// * Delete booking (Admin only)
router.delete('/:id', Authentication(UserRole.ADMIN), BookingController.deleteBooking)

export const BookingRoutes = router
