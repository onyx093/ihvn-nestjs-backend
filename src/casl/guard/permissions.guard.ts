import { CaslAbilityFactory } from '@/casl/casl-ability.factory';
import errors from '@/config/errors.config';
import { PERMISSION_METADATA } from '@/decorators/permission.decorator';
import { SUBJECT_METADATA } from '@/decorators/subject.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Read the permission from the route handler
    const requiredPermission = this.reflector.get<string>(
      PERMISSION_METADATA,
      context.getHandler()
    );
    // Read the subject from the controller
    const controllerSubject = this.reflector.get<string>(
      SUBJECT_METADATA,
      context.getClass()
    );

    // If no permission is required, allow the route to be accessed
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        errors.unauthorizedAccess('User not authenticated')
      );
    }

    // Compute the user’s ability from its roles and permissions
    const ability = this.caslAbilityFactory.createForUser(user);

    // Check if the ability allows the action (permission) on the subject
    if (!ability.can(requiredPermission, controllerSubject)) {
      throw new ForbiddenException(
        errors.forbiddenAccess(
          'You do not have permission to perform this action'
        )
      );
    }

    return true;
  }
}
