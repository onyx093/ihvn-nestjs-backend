import { Permission } from '../../permissions/entities/permission.entity';
import { setSeederFactory } from 'typeorm-extension';

export const PermissionFactory = setSeederFactory(
  Permission,
  (faker, context: Partial<Permission> = {}) => {
    const permission = new Permission({});
    // Use custom data if provided; otherwise, use faker defaults.
    permission.name = context.name || faker.person.firstName('male');
    permission.subject = context.subject || faker.person.firstName('male');
    permission.roles = context.roles || [];
    return permission;
  }
);
