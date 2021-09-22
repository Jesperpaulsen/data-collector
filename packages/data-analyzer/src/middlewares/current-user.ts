import { NextFunction, Request, Response } from 'express'

import firebaseAdmin from '../services/firebase-admin'

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
    const decodedIdToken = await firebaseAdmin.admin
      .auth()
      .verifyIdToken(idToken, true)

    const isAdmin = decodedIdToken.role === 'admin'
    req.currentUser = { ...decodedIdToken, isAdmin }
  } catch (e) {
    req.currentUser = undefined
  }
  next()
}
