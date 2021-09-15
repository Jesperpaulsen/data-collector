import { NextFunction, Request, Response } from 'express'
import admin from 'firebase-admin'

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let idToken = ''

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else if (req.cookies) {
    idToken = req.cookies.__session
  }
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken, true)
    req.currentUser = decodedIdToken
  } catch (e) {
    console.log(e)
    req.currentUser = undefined
  }
  next()
}
