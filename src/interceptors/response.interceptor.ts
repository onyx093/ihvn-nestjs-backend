import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) {
          return {
            status: 'error',
            data,
          };
        }
        return {
          status: 'success',
          statusCode: context.switchToHttp().getResponse().statusCode,
          data,
        };
      })
    );
  }
}
