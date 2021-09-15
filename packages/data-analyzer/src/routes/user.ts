import express, { NextFunction, Request, Response } from 'express'
import { checkSchema, param } from 'express-validator'

import { DatabaseConnectionError } from '../errors/database-connection-error'
import { requireAdmin } from '../middlewares/require-admin'
import { requireAuth } from '../middlewares/require-auth'
import { validateRequest } from '../middlewares/validate-request'
import UserSchema from '../schemas/UserSchema'
import firebaseAdmin from '../services/firebase-admin'

const basePath = '/user'

const generateRoute = (path = '') => {
  return `${basePath}${path}`
}

const router = express.Router()

router.post(
  generateRoute(),
  checkSchema(UserSchema()),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // pass
    } catch (e) {
      next(new DatabaseConnectionError(e.message))
    }
  }
)

router.put(
  generateRoute('/admin/:userId'),
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {}
)
