import { Schema } from 'express-validator'

const NetworkCallSchema = (isUpdate?: true): Schema => ({
  uid: {
    in: ['params'],
    optional: isUpdate ? undefined : true,
    isString: true,
    errorMessage: 'uid for network call is not valid'
  },
  userId: {
    in: ['body'],
    exists: isUpdate,
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
    exists: isUpdate,
    isString: true,
    errorMessage: 'Type is not valid'
  },
  size: {
    in: ['body'],
    exists: isUpdate,
    isNumeric: true,
    errorMessage: 'Size is not valid'
  },
  url: {
    in: ['body'],
    exists: isUpdate,
    isURL: true,
    errorMessage: 'URL is not valid'
  },
  headers: {
    in: ['body'],
    exists: isUpdate,
    isString: true,
    errorMessage: 'Headers are not valid'
  },
  timestamp: {
    in: ['body'],
    exists: isUpdate,
    isNumeric: true,
    errorMessage: 'Timestamp is not valid'
  },
  manuallyCalculated: {
    in: ['body'],
    exists: isUpdate,
    isBoolean: true,
    errorMessage: 'Manully created is not provided'
  },
  hostOrigin: {
    in: ['body'],
    exists: isUpdate,
    isString: true,
    errorMessage: 'Host origin is not valid'
  },
  hostPathname: {
    in: ['body'],
    exists: isUpdate,
    isString: true,
    errorMessage: 'Host pathname is not valid'
  }
})

export default NetworkCallSchema
