import express, { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import {
  BaseUsageDoc,
  BaseUsageDocResponse,
  NetworkCall
} from '@data-collector/types'

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
import { getDateLimit } from '../utils/date'

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

    try {
      const docId =
        await firebaseAdmin.firestore.networkCallController.storeNetworkCall(
          networkCall,
          req.currentUser!.uid
        )
      return res.status(201).send({ uid: docId })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.post(
  generateRoute('/batch'),
  requireAuth,
  checkSchema(NetworkCallSchemaInArray()),
  validateRequest,
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    const batchRequest = req.body as {
      userId: string
      networkCalls: NetworkCall[]
    }

    if (req.currentUser?.uid !== batchRequest.userId) {
      throw new NotAuthorizedError()
    }
    const promises: ReturnType<
      typeof firebaseAdmin.firestore.networkCallController.storeNetworkCall
    >[] = []

    const userId = batchRequest.userId
    for (const networkCall of batchRequest.networkCalls) {
      promises.push(
        firebaseAdmin.firestore.networkCallController.storeNetworkCall(
          {
            ...networkCall,
            userId
          },
          userId
        )
      )
    }

    try {
      await firebaseAdmin.firestore.updateUserHaveBeenActive(userId, 10)
    } catch (e) {
      // pass
      console.log(e)
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

    return res.status(200).send({ uid: networkCall.uid })

    // @TODO: Fix this update
    /*
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
    }*/
  }
)

router.get(
  generateRoute('/user/:uid'),
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params

    if (req.currentUser?.uid !== uid) {
      throw new NotAuthorizedError()
    }

    try {
      const networkCalls =
        await firebaseAdmin.firestore.networkCallController.getNetworkCallsForUser(
          uid
        )
      return res.status(200).send({ networkCalls })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.get(
  generateRoute('/users/usage-details/:uid'),
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params

    if (req.currentUser?.uid !== uid) {
      throw new NotAuthorizedError()
    }

    const details: { today: number; last7Days: number; totalUsage: number } = {
      today: 0,
      last7Days: 0,
      totalUsage: 0
    }
  }
)

router.get(
  generateRoute('/total-usage/:numberOfDays'),
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { numberOfDays } = req.params

    const limit = getDateLimit(Number(numberOfDays) || 7)
    try {
      const activeUsers =
        await firebaseAdmin.firestore.getActiveUsersAfterLimit(limit)

      const usageDocs =
        await firebaseAdmin.firestore.networkCallController.getTotalUsageAfterDate(
          limit
        )

      const usage: {
        [date: number]: {
          CO2: number
          kWh: number
          size: number
          numberOfCalls: number
        }
      } = {}

      for (const doc of usageDocs) {
        const numberOfActiveUsers = activeUsers[doc.date] || 1

        const usageDetails = {
          CO2: doc.CO2 / numberOfActiveUsers,
          kWh: doc.kWh / numberOfActiveUsers,
          size: doc.size / numberOfActiveUsers,
          numberOfCalls: doc.numberOfCalls / numberOfActiveUsers
        }
        usage[doc.date] = usageDetails
      }
      return res.status(200).send({ usage })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.get(
  generateRoute('/users/last-week/:uid'),
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.params

    if (req.currentUser?.uid !== uid) {
      throw new NotAuthorizedError()
    }

    const limit = getDateLimit(7)

    try {
      const [ownToalUsageLast7Days, allUsageLast7Days, yesterdaysUsage] =
        await Promise.all([
          firebaseAdmin.firestore.networkCallController.getTotalUsageForUser(
            uid,
            limit
          ),
          firebaseAdmin.firestore.networkCallController.getAllUsersUsage(limit),
          firebaseAdmin.firestore.networkCallController.getYesterdaysUsageForUser(
            uid
          )
        ])

      const ownAverageUsage = (ownToalUsageLast7Days || 0) / 7
      const allUsersAverageUsage = (allUsageLast7Days || 0) / 7
      return res
        .status(200)
        .send({ ownAverageUsage, allUsersAverageUsage, yesterdaysUsage })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

export { router as networkCallRouter }
