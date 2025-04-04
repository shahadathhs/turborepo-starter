import { AuthRoutes } from 'app/modules/auth/auth.routes'
import { BookingRoutes } from 'app/modules/booking/booking.routes'
import { ListingRoutes } from 'app/modules/listing/listing.routes'
import { Router } from 'express'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/listings',
    route: ListingRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
