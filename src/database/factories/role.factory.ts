import { Role } from '../../roles/entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RoleFactory = setSeederFactory(
  Role,
  (faker, context: Partial<Role> = {}) => {
    const role = new Role({});
    // Use custom data if provided; otherwise, use faker defaults.
    role.name = context.name || faker.random.word().toUpperCase();
    role.permissions = context.permissions || [];
    return role;
  }
);
