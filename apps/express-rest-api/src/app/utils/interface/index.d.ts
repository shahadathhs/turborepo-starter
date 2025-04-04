import { JwtPayload } from 'jsonwebtoken'

interface CustomJwtPayload extends JwtPayload {
  role?: string
  email?: string
}

declare global {
  namespace Express {
    interface Request {
      user: CustomJwtPayload
    }
  }
}
