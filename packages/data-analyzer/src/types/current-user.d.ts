import admin from 'firebase-admin'

declare global {
  namespace Express {
    interface Request {
      currentUser?: admin.auth.DecodedIdToken
    }
  }
}
