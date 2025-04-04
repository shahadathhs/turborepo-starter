import { httpStatusCode } from 'app/utils/enum/statusCode'
import { IErrorResponse, IErrorSource, IMongooseError } from 'app/utils/interface/error'

const handleDuplicateError = (err: IMongooseError): IErrorResponse => {
  // Extract field name and value causing the duplicate error
  const field = Object.keys(err.keyValue || {})[0]
  const value = err.keyValue ? err.keyValue[field] : 'unknown value'

  const errorSources: IErrorSource[] = [
    {
      path: field || 'unknown',
      message: `The value '${value}' already exists for the field '${field}'.`,
    },
  ]

  return {
    statusCode: httpStatusCode.BAD_REQUEST,
    message: 'Duplicate value error.',
    errorSources,
  }
}

export default handleDuplicateError
