import { Schema } from 'express-validator'

const NetworkCallSchema = (): Schema => ({
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
    isString: true,
    errorMessage: 'Type is not valid'
  },
  size: {
    in: ['body'],
    isNumeric: true,
    errorMessage: 'Size is not valid'
  },
  url: {
    in: ['body'],
    isURL: true,
    errorMessage: 'URL is not valid'
  },
  headers: {
    in: ['body'],
    isString: true,
    errorMessage: 'Headers are not valid'
  },
  timestamp: {
    in: ['body'],
    isNumeric: true,
    errorMessage: 'Timestamp is not valid'
  },
  manuallyCalculated: {
    in: ['body'],
    isBoolean: true,
    errorMessage: 'Manully created is not provided'
  },
  hostOrigin: {
    in: ['body'],
    isString: true,
    errorMessage: 'Host origin is not valid'
  },
  hostPathname: {
    in: ['body'],
    isString: true,
    errorMessage: 'Host pathname is not valid'
  }
})

export default NetworkCallSchema
