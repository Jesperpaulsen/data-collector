import { UsageDetails } from '@data-collector/types'
export const knownHeaderTypes: XMLHttpRequestResponseType[] = [
  'arraybuffer',
  'blob',
  'json',
  'text'
]

export const getContentType = (header: string): XMLHttpRequestResponseType => {
  if (header in knownHeaderTypes) return header as XMLHttpRequestResponseType
  if (header === 'octet-stream') return 'blob'
  return 'json'
}

export const getContentTypeHeader = (
  header: string | null
): XMLHttpRequestResponseType => {
  console.log(header)
  if (!header) return 'json'
  const contentTypeHeaders = header.split('/')
  if (contentTypeHeaders[0] === 'text') {
    return 'text'
  } else if (
    contentTypeHeaders[0] === 'application' &&
    contentTypeHeaders.length > 1
  ) {
    return getContentType(contentTypeHeaders[1])
  } else if (contentTypeHeaders[0] === 'image') {
    return 'blob'
  } else {
    return 'text'
  }
}

export const accUsageDetails = <T>(usage: UsageDetails, usageObject: T) => {
  const res = { ...usageObject }
  for (const [key, value] of Object.entries(usage)) {
    res[key] = (value || 0) + (res[key] || 0)
  }
  return res
}

export const convertDateToUTC = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}
