import { Schema } from 'express-validator'

const UserSchema = (isUpdate?: true): Schema => {
  const optional = isUpdate ? true : undefined

  return {
    uid: {
      in: ['params'],
      optional: isUpdate ? undefined : true,
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
      optional,
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
      optional,
      isEmail: true,
      errorMessage: 'E-mail is not valid'
    },
    password: {
      in: ['body'],
      optional,
      isString: true,
      isLength: {
        options: {
          min: 6
        }
      },
      errorMessage: 'Password is not valid'
    }
  }
}

export default UserSchema
