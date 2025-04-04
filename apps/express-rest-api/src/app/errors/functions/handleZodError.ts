import { httpStatusCode } from 'app/utils/enum/statusCode'
import { IErrorResponse, IErrorSource } from 'app/utils/interface/error'
import { ZodError, ZodIssue } from 'zod'

const handleZodError = (err: ZodError): IErrorResponse => {
  const errorSources: IErrorSource[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    }
  })

  return {
    statusCode: httpStatusCode.BAD_REQUEST,
    message: 'Validation Error. Enter valid data',
    errorSources,
  }
}

export default handleZodError
