import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client'; // adjust import path to your generated client

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name, {
    timestamp: true,
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // 1. Handle Prisma errors first

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ statusCode, message, error } = this.handlePrismaKnownError(exception));
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
      error = 'Bad Request';
    } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Internal Server Error';
      error = 'Bad Request';
    }

    // 2. handle HttpException (including ValidationPipe Bad Request exceptions)
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, any>;
        message = resp.message || exception.message;
        error = resp.error || exception.name;
      }
    }

    // log exception
    this.logger.error(exception);

    // standard response shape
    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let error = 'Internal Server Error';

    switch (exception.code) {
      case 'P2002': // unique constraint failed
        statusCode = HttpStatus.CONFLICT;
        this.logger.error(
          `Unique constraint failed on field(s): ${(exception.meta?.target as string[])?.join(', ')}`,
        );
        message = 'Unique Constraint Violation';
        error = 'Conflict';
        break;

      case 'P2025': // record not found
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'Not Found';
        break;

      case 'P2003': // foreign key constraint failed
        statusCode = HttpStatus.BAD_REQUEST;
        this.logger.error(
          `Foreign key constraint failed on field(s): ${(exception.meta?.field_name as string[])?.join(', ')}`,
        );
        message = 'Foreign key constraint violation';
        error = 'Bad Request';
        break;

      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        this.logger.error(
          `Unhandled database error (${exception.code}): ${exception.message}`,
        );
        message = 'Internal Server Error';
        error = 'Internal Server Error';
    }

    return { statusCode, message, error };
  }
}
