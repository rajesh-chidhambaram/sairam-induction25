// API utilities for consistent error handling and response formatting

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export class ApiErrorHandler {
  static handleMongooseError(error: any): ApiError {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return {
        message: messages.join(', '),
        statusCode: 400,
        code: 'VALIDATION_ERROR'
      };
    }

    if (error.name === 'MongoNetworkError') {
      return {
        message: 'Database connection error. Please try again later.',
        statusCode: 503,
        code: 'DATABASE_CONNECTION_ERROR'
      };
    }

    if (error.name === 'CastError') {
      return {
        message: 'Invalid data format',
        statusCode: 400,
        code: 'INVALID_DATA_FORMAT'
      };
    }

    if (error.code === 11000) {
      return {
        message: 'Admission ID already exists',
        statusCode: 409,
        code: 'DUPLICATE_ENTRY'
      };
    }

    return {
      message: 'An unexpected error occurred. Please try again later.',
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR'
    };
  }

  static createResponse(success: boolean, message: string, data?: any, statusCode: number = 200) {
    return {
      success,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString()
    };
  }
}

export const createSuccessResponse = (message: string, data?: any) => {
  return ApiErrorHandler.createResponse(true, message, data, 200);
};

export const createErrorResponse = (message: string, statusCode: number = 500, code?: string) => {
  return {
    success: false,
    message,
    ...(code && { code }),
    timestamp: new Date().toISOString()
  };
};

// Utility for consistent logging
export const logApiRequest = (method: string, endpoint: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${method} ${endpoint}`, data ? { data } : '');
};

export const logApiError = (error: any, context: string) => {
  console.error(`[${new Date().toISOString()}] Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
};