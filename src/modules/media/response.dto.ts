import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({ description: 'HTTP status code', example: 200 })
  statusCode: number;

  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({ description: 'Message for the response', example: 'API responded successfully!' })
  message: string;

  @ApiProperty({ description: 'Timestamp in ms', example: Date.now() })
  timestamp: number;

  @ApiProperty({ description: 'Request path', example: '/api/media/upload' })
  path: string;

  @ApiProperty({ description: 'Actual data returned', type: Object })
  data: T | null;
}
