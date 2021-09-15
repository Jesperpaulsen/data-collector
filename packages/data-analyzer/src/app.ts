import { json } from 'body-parser'
import cors from 'cors'
import express from 'express'

import 'express-async-errors'

import { NotFoundError } from './errors/not-found-error'
import { currentUser } from './middlewares/current-user'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(json())
app.use(cors())

app.use(currentUser)

app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
