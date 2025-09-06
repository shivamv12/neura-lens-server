export interface ApiResponse<T = any> {
  statusCode: number;
  status: 'success' | 'error';
  message?: string;
  errorMessage?: string;
  data?: T;
}
