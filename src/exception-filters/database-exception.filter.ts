import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

interface PostgresError extends Error {
  code: string;
  detail: string;
}

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.driverError as PostgresError; // Cast to PostgreSQL error type

    // Handle duplicate key constraint (error code 23505)
    if (error.code === '23505') {
      response.status(409).json({
        status: 'error',
        data: {
          statusCode: 409,
          message: 'Conflict: Duplicate entry',
          details: error.detail,
        },
      });
    } else {
      // Fallback for other database errors
      response.status(500).json({
        status: 'error',
        data: { statusCode: 500, message: 'Internal server error (database)' },
      });
    }
  }
}
