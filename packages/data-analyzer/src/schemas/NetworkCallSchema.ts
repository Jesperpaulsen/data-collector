import { Schema } from 'express-validator'

const NetworkCallSchema = (isUpdate?: true): Schema => {
  const optional = isUpdate ? true : undefined
  return {
    uid: {
      in: ['params'],
      optional: isUpdate ? undefined : true,
      isString: true,
      errorMessage: 'uid for network call is not valid'
    },
    userId: {
      in: ['body'],
      exists: true,
      isString: true,
      isLength: {
        errorMessage: 'userId is not valid',
        options: {
          min: 28,
          max: 28
        }
      }
    },
    type: {
      in: ['body'],
      optional,
      isString: true,
      errorMessage: 'Type is not valid'
    },
    size: {
      in: ['body'],
      optional,
      isNumeric: true,
      errorMessage: 'Size is not valid'
    },
    targetOrigin: {
      in: ['body'],
      optional,
      isURL: true,
      errorMessage: 'targetOrigin is not valid'
    },
    targetPathname: {
      in: ['body'],
      optional,
      isString: true,
      errorMessage: 'targetPathname is not valid'
    },
    headers: {
      in: ['body'],
      optional,
      isString: true,
      errorMessage: 'Headers are not valid'
    },
    timestamp: {
      in: ['body'],
      optional,
      isNumeric: true,
      errorMessage: 'Timestamp is not valid'
    },
    manuallyCalculated: {
      in: ['body'],
      optional,
      isBoolean: true,
      errorMessage: 'Manully created is not provided'
    },
    hostOrigin: {
      in: ['body'],
      optional,
      isURL: true,
      errorMessage: 'Host origin is not valid'
    },
    hostPathname: {
      in: ['body'],
      optional,
      isString: true,
      errorMessage: 'Host pathname is not valid'
    }
  }
}

export default NetworkCallSchema
