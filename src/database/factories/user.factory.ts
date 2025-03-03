import { User } from '../../users/entities/user.entity';
import { hash } from 'argon2';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(
  User,
  async (faker, context: Partial<User> = {}) => {
    const user = new User({});
    // Use custom data if provided; otherwise, use faker defaults.
    user.name = context.name || faker.person.firstName();
    user.username = context.username || faker.person.firstName();
    user.email =
      context.email || `${user.username}@${faker.internet.domainName()}`;
    user.password = await hash('password');
    user.roles = context.roles || [];

    return user;
  }
);
