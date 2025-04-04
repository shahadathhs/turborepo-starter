import { configuration } from 'app/config/config'
import { Request, Response, NextFunction } from 'express'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()],
})

const apiInfoLogger = (req: Request, res: Response, next: NextFunction) => {
  // Log request details by passing an object directly
  const logDetails = {
    method: req.method,
    url: req.url,
    body: req.body && Object.keys(req.body).length > 0 ? req.body : 'N/A',
    query: req.query && Object.keys(req.query).length > 0 ? req.query : 'N/A',
    params: req.params && Object.keys(req.params).length > 0 ? req.params : 'N/A',
    token: configuration.env === 'development' ? req.headers.authorization || 'N/A' : null,
    cookies: configuration.env === 'development' ? req.cookies || 'N/A' : null,
  }

  logger.info({ type: 'request', logDetails })

  // Capture response body safely
  let responseBody: unknown = null
  const originalSend = res.send.bind(res)
  const originalJson = res.json.bind(res)

  res.send = function (body: unknown): Response {
    if (!res.headersSent) {
      responseBody = body
      return originalSend(body)
    }
    return res
  }

  res.json = function (body: unknown): Response {
    if (!res.headersSent) {
      responseBody = body
      return originalJson(body)
    }
    return res
  }

  res.on('finish', () => {
    let prettyResponseBody: unknown = responseBody
    if (typeof responseBody === 'string') {
      try {
        prettyResponseBody = JSON.parse(responseBody)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        // If it's not valid JSON, keep it as the original string.
        prettyResponseBody = responseBody
      }
    }
    const responseLog = {
      type: 'response',
      responseBody: prettyResponseBody || 'No response body',
    }
    logger.info(responseLog)
  })

  next()
}

export default apiInfoLogger
