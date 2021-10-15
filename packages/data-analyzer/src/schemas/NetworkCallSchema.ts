import { Schema } from 'express-validator'

const getBaseSchema = (isUpdate?: true): Schema => {
  const exists = isUpdate ? undefined : true
  return {
    size: {
      in: ['body'],
      exists,
      isNumeric: true,
      errorMessage: 'Size is not valid'
    },
    hostOrigin: {
      in: ['body'],
      exists,
      isString: true,
      errorMessage: 'Host origin is not valid'
    },
    targetIP: {
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
