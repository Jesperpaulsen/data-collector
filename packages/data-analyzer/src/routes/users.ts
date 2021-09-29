import express, { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import { User } from '@data-collector/types'

import { DatabaseConnectionError } from '../errors/database-connection-error'
import { NotAuthorizedError } from '../errors/not-authorized-error'
import { requireAdmin } from '../middlewares/require-admin'
import { requireAuth } from '../middlewares/require-auth'
import { sanitizeData } from '../middlewares/sanitize-data'
import { validateRequest } from '../middlewares/validate-request'
import UserSchema from '../schemas/UserSchema'
import firebaseAdmin from '../services/firebase-admin'

const basePath = '/users'

const generateRoute = (path = '') => {
  return `${basePath}${path}`
}

const router = express.Router()

router.post(
  generateRoute(),
  checkSchema(UserSchema()),
  validateRequest,
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body

      const userAuth = await firebaseAdmin.auth.createUser({
        displayName: name,
        email,
        password
      })

      const user: User = {
        email,
        name,
        uid: userAuth.uid,
        role: 'user',
        totalCO2: 0,
        totalSize: 0
      }

      await firebaseAdmin.firestore.createUser(user)

      res
        .status(201)
        .send({ email: user.email, name: user.name, uid: user.uid })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.post(
  generateRoute('/extension/:uid'),
  checkSchema({
    uid: {
      in: ['params'],
      exists: true,
      isString: true,
      isLength: {
        errorMessage: 'uid is not valid',
        options: {
          min: 28,
          max: 28
        }
      }
    },
    name: {
      in: ['body'],
      isString: true,
      exists: true,
      errorMessage: 'Name is not valid'
    },
    email: {
      in: ['body'],
      exists: true,
      isEmail: true,
      errorMessage: 'E-mail is not valid'
    }
  }),
  requireAuth,
  validateRequest,
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name } = req.body
      const { uid } = req.params

      if (uid !== req.currentUser?.uid && !req.currentUser?.isAdmin) {
        throw new NotAuthorizedError()
      }

      const checkIfUserExists = await firebaseAdmin.firestore.checkIfUserExists(
        uid
      )

      if (checkIfUserExists) {
        res.status(201).send({ email, name, uid, role: 'user' })
        return
      }

      const user: User = {
        email,
        name,
        uid,
        role: 'user',
        totalCO2: 0,
        totalSize: 0
      }

      await firebaseAdmin.firestore.createUser(user)

      res
        .status(201)
        .send({ email: user.email, name: user.name, uid: user.uid })
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.put(
  generateRoute('/admin/:uid'),
  requireAdmin,
  checkSchema({
    uid: {
      in: ['params'],
      exists: true,
      isString: true,
      isLength: {
        errorMessage: 'uid is not valid',
        options: {
          min: 28,
          max: 28
        }
      }
    },
    role: {
      in: ['body'],
      exists: true,
      isString: true,
      errorMessage: 'Role is not valid'
    }
  }),
  validateRequest,
  sanitizeData,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await firebaseAdmin.auth.updateUserRole(req.params.uid, req.body.role)
      res.status(200).send()
    } catch (e: any) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

export { router as userRouter }
