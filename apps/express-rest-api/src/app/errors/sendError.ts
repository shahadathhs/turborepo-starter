import { configuration } from 'app/config/config'
import { IErrorResponse } from 'app/utils/interface/error'
import { Response } from 'express'

const sendError = (res: Response, error: IErrorResponse) => {
  res.status(error.statusCode).send({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    error: error.errorSources,
    stack: configuration.env === 'development' ? error.stack : undefined,
  })
}

export default sendError
