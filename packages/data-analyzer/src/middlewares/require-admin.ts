import { NextFunction, Request, Response } from 'express'

import { NotAuthorizedError } from '../errors/not-authorized-error'

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.currentUser
  if (!user) throw new NotAuthorizedError()
  const role = user.role
  if (role !== 'admin') throw new NotAuthorizedError()
  next()
}
