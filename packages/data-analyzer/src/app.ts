import { json } from 'body-parser'
import cors from 'cors'
import express from 'express'

import 'express-async-errors'

import { NotFoundError } from './errors/not-found-error'
import { corsOptions } from './middlewares/cors-options'
import { currentUser } from './middlewares/current-user'
import { errorHandler } from './middlewares/error-handler'
import { networkCallRouter } from './routes/network-call'
import { userRouter } from './routes/users'
import envLoader from './services/env-loader'

envLoader.loadEnvs()

const app = express()

app.use(json({ limit: '50mb' }))
app.use(cors(corsOptions))

app.use(currentUser)

app.use(userRouter)
app.use(networkCallRouter)

app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
