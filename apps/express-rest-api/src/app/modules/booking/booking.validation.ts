import { z } from 'zod'

const createBookingSchema = z.object({
  body: z.object({
    // * Listing ID must be provided
    listing: z.string({ required_error: 'Listing ID is required' }),
    // * Check-in date must be a valid date string
    checkInDate: z
      .string({ required_error: 'Check-in date is required' })
      .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid check-in date' }),
    // * Check-out date must be a valid date string
    checkOutDate: z
      .string({ required_error: 'Check-out date is required' })
      .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid check-out date' }),
    tenantMessage: z.string({ required_error: 'Tenant message is required' }),
    landlord: z.string({ required_error: 'Landlord ID is required' }),
  }),
})

const updateBookingSchema = z.object({
  body: z.object({
    // * Booking status must be one of the allowed values
    status: z.enum(['pending', 'confirmed', 'cancelled', 'approved', 'rejected'], {
      required_error: 'Status is required',
    }),
  }),
})

export const BookingValidation = {
  createBookingSchema,
  updateBookingSchema,
}
