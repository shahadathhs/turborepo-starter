import AppError from 'app/errors/functions/AppError'
import sendError from 'app/errors/sendError'
import simplifyError from 'app/errors/simplifyError'
import { TJwtPayload, TRole } from 'app/modules/auth/auth.user.interface'
import User from 'app/modules/auth/auth.user.model'
import { verifyToken } from 'app/modules/auth/auth.utils'
import { httpStatusCode } from 'app/utils/enum/statusCode'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export default function Authentication(...requiredRoles: TRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization

      // * Step 1: Check if the Authorization header is present
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'You are not authorized!')
      }

      // * Step 2: Extract the token
      const token = authHeader.split(' ')[1]

      // * Step 3: Verify the token
      const decoded = verifyToken(token) as TJwtPayload

      if (!decoded) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid token!')
      }

      // * Validate the token payload
      const { email, userId, role } = decoded
      if (!email) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid email in token!')
      }

      if (!userId || !mongoose.isValidObjectId(userId)) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Invalid userId in token!')
      }

      if (!role) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, 'Missing role in token!')
      }

      // * Check if the user exists
      const user = await User.findById(userId)
      const isUserExist = await User.findOne({ email })
      if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, 'This user is not found!')
      }

      if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, 'This user is not found!')
      }

      // * Check if the user is blocked
      if (user.isActive === false) {
        throw new AppError(httpStatusCode.FORBIDDEN, 'Your account is deactivated!')
      }

      // * Check if the user has the required role
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(
          httpStatusCode.FORBIDDEN,
          'You are not authorized to perform this action!',
        )
      }

      // * Attach user information to the request object
      req.user = decoded

      // * Move to the next middleware
      next()
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        const error = new AppError(
          httpStatusCode.UNAUTHORIZED,
          err.message || 'Invalid token pls login again!',
        )
        const errorResponse = simplifyError(error)
        sendError(res, errorResponse)
        next(error)
      } else {
        const errorResponse = simplifyError(err)
        sendError(res, errorResponse)
        next(err)
      }
    }
  }
}
