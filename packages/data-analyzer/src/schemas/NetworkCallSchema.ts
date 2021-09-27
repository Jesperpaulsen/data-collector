import { Schema } from 'express-validator'

const getBaseSchema = (isUpdate?: true): Schema => {
  const exists = isUpdate ? undefined : true
  return {
    type: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'Type is not valid'
    },
    size: {
      in: ['body'],
      exists,
      isNumeric: true,
      errorMessage: 'Size is not valid'
    },
    targetOrigin: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'targetOrigin is not valid'
    },
    targetPathname: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'targetPathname is not valid'
    },
    headers: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'Headers are not valid'
    },
    timestamp: {
      in: ['body'],
      exists,
      isNumeric: true,
      errorMessage: 'Timestamp is not valid'
    },
    manuallyCalculated: {
      in: ['body'],
      exists,
      isBoolean: true,
      errorMessage: 'Manully created is not provided'
    },
    hostOrigin: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'Host origin is not valid'
    },
    hostPathname: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'Host pathname is not valid'
    }
  }
}

const NetworkCallSchema = (isUpdate?: true): Schema => {
  const baseSchema = getBaseSchema(isUpdate)
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
    ...baseSchema
  }
}

// TODO: Look at how we can sanitize this data
export const NetworkCallSchemaInArray = (isUpdate?: true): Schema => {
  const baseSchema = getBaseSchema(isUpdate)
  const newSchema = {}
  for (const [key, value] of Object.entries(baseSchema)) {
    newSchema[`networkCalls.*.${key}`] = {
      ...value,
      optional: true
    }
  }
  return {
    ...newSchema,
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
    networkCalls: {
      in: ['body'],
      exists: true,
      isArray: true,
      errorMessage: 'Networkcalls is not valid'
    }
  }
}

export default NetworkCallSchema
