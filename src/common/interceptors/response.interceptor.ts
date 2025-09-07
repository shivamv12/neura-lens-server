import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';

import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: any): ApiResponse => ({
        statusCode,
        status: statusCode >= 400 ? 'error' : 'success',
        message: response.statusMessage ?? 'API responded successfully!',
        timestamp: data?.timestamp ?? Date.now(),
        // version: 'v2',
        path: request.url,
        data,
      })),
      catchError((err: unknown) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;
        const message = err instanceof HttpException || err instanceof Error ? err.message : 'Internal server error! Please try again.';

        const errorResponse: ApiResponse<null> = {
          statusCode,
          status: 'error',
          message,
          timestamp: Date.now(),
          // version: 'v2',
          path: request.url,
          data: null,
        };

        return throwError(() => new HttpException(errorResponse, statusCode));
      })
    );
  }
}
