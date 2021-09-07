declare interface NetworkCall {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  type: XMLHttpRequest['responseType'];
  size: number | null;
  url: string;
  headers: string;
}
