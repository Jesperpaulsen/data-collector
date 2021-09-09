var knownHeaderTypes = ['arraybuffer', 'blob', 'json', 'text'];
var getContentType = function (header) {
  if (header in knownHeaderTypes) return header;
  return 'json';
};
var getContentTypeHeader = function (header) {
  if (!header) return 'json';
  var contentTypeHeaders = header.split('/');
  if (contentTypeHeaders[0] === 'text') {
    return 'text';
  } else if (contentTypeHeaders[0] === 'application' && contentTypeHeaders.length > 1) {
    return getContentType(contentTypeHeaders[1]);
  } else {
    return 'text';
  }
};
export { getContentTypeHeader };
