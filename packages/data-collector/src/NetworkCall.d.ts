declare interface NetworkCall {
  type: XMLHttpRequestResponseType;
  size?: number | null;
  data?: any;
  url: string;
  headers: string;
  timestamp: number;
  manuallyCalculated?: boolean;
}
