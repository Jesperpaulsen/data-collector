import express, { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import { NetworkCall } from '@data-collector/types'

import { DatabaseConnectionError } from '../errors/database-connection-error'
import { NotAuthorizedError } from '../errors/not-authorized-error'
import { requireAuth } from '../middlewares/require-auth'
import { validateRequest } from '../middlewares/validate-request'
import NetworkCallSchema from '../schemas/NetworkCallSchema'
import firebaseAdmin from '../services/firebase-admin'

const basePath = '/network-call'

const generateRoute = (path = '') => {
  return `${basePath}${path}`
}

const router = express.Router()

router.post(
  generateRoute(),
  requireAuth,
  checkSchema(NetworkCallSchema()),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const networkCall: NetworkCall = req.body

    if (req.currentUser?.uid !== networkCall.userId) {
      throw new NotAuthorizedError()
    }

    try {
      await firebaseAdmin.firestore.createNetworkCall(networkCall)
      return res.status(201).send()
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

export { router as networkCallRouter }
