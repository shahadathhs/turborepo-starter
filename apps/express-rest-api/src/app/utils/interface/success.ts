export interface ISuccessResponse {
  statusCode: number
  success: boolean
  message: string
  data?: object | Array<object> | null
}
