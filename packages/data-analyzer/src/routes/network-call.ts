import express, { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import { NetworkCall } from '@data-collector/types'

import { BadRequestError } from '../errors/bad-request-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'
import { NotAuthorizedError } from '../errors/not-authorized-error'
import { requireAuth } from '../middlewares/require-auth'
import { sanitizeData } from '../middlewares/sanitize-data'
import { validateRequest } from '../middlewares/validate-request'
import NetworkCallSchema, {
  NetworkCallSchemaInArray
} from '../schemas/NetworkCallSchema'
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
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    const networkCall: NetworkCall = req.body

    if (req.currentUser?.uid !== networkCall.userId) {
      throw new NotAuthorizedError()
    }
    console.log(req.body)

    try {
      const docId = await firebaseAdmin.firestore.createNetworkCall(networkCall)
      return res.status(201).send({ uid: docId })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.post(
  generateRoute('/batch'),
  requireAuth,
  /*checkSchema(NetworkCallSchemaInArray()),
  validateRequest,
  sanitizeData,*/
  async (req: Request, res: Response, next: NextFunction) => {
    const batchRequest = req.body as {
      userId: string
      networkCalls: NetworkCall[]
    }

    console.log(batchRequest)

    if (req.currentUser?.uid !== batchRequest.userId) {
      throw new NotAuthorizedError()
    }
    const promises: Promise<string>[] = []

    for (const networkCall of batchRequest.networkCalls) {
      promises.push(
        firebaseAdmin.firestore.createNetworkCall({
          ...networkCall,
          userId: batchRequest.userId
        })
      )
    }

    try {
      const ids = await Promise.all(promises)
      return res.status(201).send({ ids })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.put(
  generateRoute('/:uid'),
  requireAuth,
  checkSchema(NetworkCallSchema(true)),
  validateRequest,
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    const networkCall: NetworkCall = req.body

    if (!networkCall.uid) {
      throw new BadRequestError('Missing uid for network call')
    }

    if (req.currentUser?.uid !== networkCall.userId) {
      throw new NotAuthorizedError()
    }

    const existingNetworkCall = await firebaseAdmin.firestore.getNetworkCall(
      networkCall.uid!
    )

    if (existingNetworkCall.userId !== req.currentUser?.uid) {
      throw new NotAuthorizedError()
    }

    try {
      await firebaseAdmin.firestore.updateNetworkCall(
        networkCall.uid,
        networkCall
      )
      return res.status(200).send({ uid: networkCall.uid })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

export { router as networkCallRouter }
