import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'

export const sanitizeData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sanitizedData = matchedData(req, { includeOptionals: false })
  req.body = { ...sanitizedData }
  next()
}
