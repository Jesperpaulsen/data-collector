export const getContentType = (header: string): XMLHttpRequestResponseType => {
  const knownHeaderTypes: XMLHttpRequestResponseType[] = [
    'arraybuffer',
    'blob',
    'json',
    'text'
  ]
  if (header in knownHeaderTypes) return header as XMLHttpRequestResponseType
  return 'json'
}

export const getContentTypeHeader = (
  header: string | null
): XMLHttpRequestResponseType => {
  if (!header) return 'json'
  const contentTypeHeaders = header.split('/')
  if (contentTypeHeaders[0] === 'text') {
    return 'text'
  } else if (
    contentTypeHeaders[0] === 'application' &&
    contentTypeHeaders.length > 1
  ) {
    return getContentType(contentTypeHeaders[1])
  } else {
    return 'text'
  }
}
