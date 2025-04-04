import { configuration } from 'app/config/config'
import { Request, Response } from 'express'

const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
) => {
  // * Log the error in development mode
  if (configuration.env === 'development') console.error(err)

  // * Send a generic error message if the error wasn't handled
  if (!res.headersSent) {
    const statusCode = err.statusCode || 500
    const message = configuration.env === 'development' ? err.message : 'Internal Server Error'

    res.status(statusCode).send({
      success: false,
      statusCode,
      message,
      error: err.errorSources,
      stack: configuration.env === 'development' ? err.stack : undefined,
    })
  }
}

export default errorHandler
