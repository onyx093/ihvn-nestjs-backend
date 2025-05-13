import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import fs from 'fs';
import { Observable, tap } from 'rxjs';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file?.path ? request.file : null;

    return next.handle().pipe(
      tap({
        error: () => {
          if (file && fs.existsSync(file.path)) {
            try {
              fs.unlinkSync(file.path);
            } catch (error) {
              console.error('Error cleaning up file:', error);
            }
          }
        },
      })
    );
  }
}
