import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T>(data: T, message?: string, status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
        message: message || 'Success',
      },
      { 
        status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }

  static error(message: string, status: number = 400, details?: any) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        details,
      },
      { 
        status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }

  static notFound(message: string = 'Resource not found') {
    return this.error(message, 404);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return this.error(message, 401);
  }

  static forbidden(message: string = 'Forbidden') {
    return this.error(message, 403);
  }

  static serverError(message: string = 'Internal server error') {
    return this.error(message, 500);
  }
}