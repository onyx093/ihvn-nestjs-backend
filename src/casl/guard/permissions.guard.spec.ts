import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

describe('PermissionsGuard', () => {
  let reflector: Reflector;
  let abilityFactory: CaslAbilityFactory;
  let guard: PermissionsGuard;

  beforeEach(() => {
    reflector = new Reflector();
    abilityFactory = new CaslAbilityFactory();
    guard = new PermissionsGuard(reflector, abilityFactory);
  });

  const mockContext = (options: {
    permission?: string;
    subject?: string;
    user?: any;
  }): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user: options.user,
        }),
      }),
      getHandler: () => {
        const fn = () => {};
        Reflect.defineMetadata('PERMISSION_METADATA', options.permission, fn);
        return fn;
      },
      getClass: () => {
        class Dummy {}
        Reflect.defineMetadata('SUBJECT_METADATA', options.subject, Dummy);
        return Dummy;
      },
    } as any;
  };
  it('should be defined', () => {
    expect(new PermissionsGuard(reflector, abilityFactory)).toBeDefined();
  });

  it('should throw UnauthorizedException when no user is attached', () => {
    const context = mockContext({
      permission: 'read_articles',
      subject: 'Article',
      user: null,
    });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow access if no permission metadata is present', () => {
    const context = mockContext({
      permission: null,
      subject: 'Article',
      user: { roles: [] },
    });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if the ability does not allow the action', () => {
    // Create a user whose roles do not include the required permission.
    const user = { roles: [] };
    const context = mockContext({
      permission: 'delete_articles',
      subject: 'Article',
      user,
    });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access if the ability allows the action', () => {
    // Build a user that has a permission for the action.
    const user = {
      roles: [
        {
          permissions: [{ name: 'read_articles', subject: 'Article' }],
        },
      ],
    };
    const context = mockContext({
      permission: 'read_articles',
      subject: 'Article',
      user,
    });
    expect(guard.canActivate(context)).toBe(true);
  });
});
