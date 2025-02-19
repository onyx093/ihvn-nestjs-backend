import errors from '@/config/errors.config';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<any>) {}
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
      return value;
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          error: err.message,
        }));

        throw new BadRequestException(
          errors.validationFailedWithFieldErrors(formattedErrors)
        );
      }

      throw error;
    }
  }
}
