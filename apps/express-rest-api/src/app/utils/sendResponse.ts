import { Response } from 'express'

import { ISuccessResponse } from './interface/success'

const sendResponse = (res: Response, data: ISuccessResponse) => {
  const response: ISuccessResponse = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
  }

  // * Add the `data` key only if it is defined
  if (data.data !== undefined) {
    response.data = data.data
  }

  res.status(data.statusCode).json(response)
}

export default sendResponse
