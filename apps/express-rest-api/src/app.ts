import apiInfoLogger from 'app/middlewares/apiInfoLogger'
import errorHandler from 'app/middlewares/errorHandler'
import notFound from 'app/middlewares/notFound'
import appRoutes from 'app/routes/router'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'

// ** express app **
const app: Application = express()

// ** parse request body **
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ** cors **
app.use(cors())

// ** API Info Logger **
app.use(apiInfoLogger)

// ** Default Routes **
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Bari Sathi Server!')
})
app.get('/api', (req: Request, res: Response) => {
  res.send('This is the root API route!')
})

// ** API Routes **
app.use('/api', appRoutes)

// ** API Endpoint Not Found **
app.use('*', (req: Request, res: Response) => {
  notFound(req, res)
})

// ** Error Handler **
app.use(errorHandler)

export default app
