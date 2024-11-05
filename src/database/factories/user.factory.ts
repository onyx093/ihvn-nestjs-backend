import { User } from '@/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User({
    name: faker.person.fullName({ sex: 'male' }),
    email: faker.internet.email('male'),
    password: faker.internet.password(),
  });
  return user;
});
