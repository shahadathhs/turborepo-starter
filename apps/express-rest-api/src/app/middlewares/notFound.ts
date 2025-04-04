import { httpStatusCode } from 'app/utils/enum/statusCode'
import { Request, Response } from 'express'

const notFound = (req: Request, res: Response) => {
  return res.status(httpStatusCode.NOT_FOUND).send({
    status: httpStatusCode.NOT_FOUND,
    success: false,
    message: 'API Not Found or Invalid URL!!',
  })
}

export default notFound
