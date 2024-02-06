import {
    BadRequestException,
    ConflictException,
    NotFoundException,
  } from '@nestjs/common';
  
  export const responses = {
    task: {
      409: {
        message: 'Conflict',
        error: 'This task already exists',
        Exception: ConflictException,
      },
      404: {
        message: 'Not Found',
        error: 'Task not found',
        Exception: NotFoundException,
      },
      400: {
        message: 'Bad request',
        error: 'Invalid request format',
        Exception: BadRequestException,
      },
      201: {
        message: 'Task successfully created!',
      },
      200: {
        message: 'Successful operation',
      },
    },
    category: {
      409: {
        message: 'Conflict',
        error: 'This category already exists',
        Exception: ConflictException,
      },
      404: {
        message: 'Not Found',
        error: 'Category not found',
        Exception: NotFoundException,
      },
      400: {
        message: 'Bad request',
        error: 'Invalid request format',
        Exception: BadRequestException,
      },
      201: {
        message: 'Category successfully created!',
      },
      200: {
        message: 'Successful operation',
      },
    },
  };
  
  export function generateError(
    model: 'task' | 'category',
    errorCode: 409 | 404 | 400,
  ) {
    const { error, Exception, message } = responses[model][errorCode];
  
    throw new Exception(message, {
      cause: new Error(error + ' - Error Code: ' + errorCode),
      description: error,
    });
  }