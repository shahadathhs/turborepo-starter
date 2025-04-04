import { AuthRoutes } from 'app/modules/auth/auth.routes'
import { Router } from 'express'

const appRoutes = Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

moduleRoutes.forEach(route => appRoutes.use(route.path, route.route))

export default appRoutes
