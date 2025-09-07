export interface ApiResponse<T = any> {
  statusCode: number;
  status: 'success' | 'error';
  message: string;
  data: T;
  path: string;
  timestamp: number;
  version?: string
}
