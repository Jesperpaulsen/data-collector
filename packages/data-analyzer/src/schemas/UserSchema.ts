import { Schema } from 'express-validator'

const UserSchema = (update?: true): Schema => ({
  uid: {
    in: ['params'],
    optional: update ? undefined : true,
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
    exists: update,
    isString: true,
    isLength: {
      options: {
        min: 2
      }
    },
    errorMessage: 'Name is not valid'
  },
  email: {
    in: ['body'],
    exists: update,
    isEmail: true,
    errorMessage: 'E-mail is not valid'
  },
  password: {
    in: ['body'],
    exists: update,
    isString: true,
    isLength: {
      options: {
        min: 6
      }
    },
    errorMessage: 'Password is not valid'
  }
})

export default UserSchema
