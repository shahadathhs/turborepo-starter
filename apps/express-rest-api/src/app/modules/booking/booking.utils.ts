import { IBooking } from './booking.interface'

export type TGetBookings = {
  bookings: IBooking[]
  metadata: {
    total: number
    page: number
    limit: number
  }
}

export type TQueryOptions = {
  page?: number
  limit?: number
  status?: string
}
