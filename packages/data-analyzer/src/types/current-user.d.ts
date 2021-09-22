import admin from 'firebase-admin'

interface CurrentUser extends admin.auth.DecodedIdToken {
  isAdmin: boolean
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser
    }
  }
}
