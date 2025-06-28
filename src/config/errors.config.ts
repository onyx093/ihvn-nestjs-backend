import { HttpStatus } from '@nestjs/common';

type ValidationFields = {
  field: string;
  error: string;
};

const errors = {
  validationFailed: (message?: string) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ?? 'Validation Failed',
  }),
  validationFailedWithFieldErrors: (
    errors: ValidationFields[],
    message?: string
  ) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ?? 'One or more fields failed validation',
    errors,
  }),
  authenticationFailed: (message?: string) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ?? 'Validation Failed',
  }),
  badRequest: (message?: string) => ({
    statusCode: HttpStatus.BAD_REQUEST,
    message: message ?? 'Could not complete this request',
  }),
  unauthorizedAccess: (message?: string) => ({
    statusCode: HttpStatus.UNAUTHORIZED,
    message: message ?? 'Try logging in, to access this resource',
  }),
  forbiddenAccess: (message?: string) => ({
    statusCode: HttpStatus.FORBIDDEN,
    message: message ?? 'You do not have permission to access this resource',
  }),
  notFound: (message?: string) => ({
    statusCode: HttpStatus.NOT_FOUND,
    message: message ?? 'The requested resource could not be found',
  }),
  conflictError: (message?: string) => ({
    statusCode: HttpStatus.CONFLICT,
    message: message ?? 'A user with the same email already exists',
  }),
  tooManyRequests: (message?: string) => ({
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message:
      message ??
      'You have exceeded the rate limit for this resource. Please try again after some time',
  }),
  serverError: (message?: string) => ({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: message ?? 'An unexpected error occurred on the server',
  }),

  formatZodErrors: (error) => {
    return error.errors.map((err) => ({
      field: err.path.join('.'),
      error: err.message,
    }));
  },
};

export default errors;

/* 
map((data) => {
  if (data instanceof HttpException) {
    const response = data.getResponse();
    const status = data.getStatus();
    const message = data.message || data.getResponse();
    return {
      statusCode: status,
      message,
      ...response,
    };
  }
  return {
    statusCode: HttpStatus.OK,
    message: 'Success',
    data,
  };
})

*/
