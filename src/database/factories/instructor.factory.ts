import { User } from '../../users/entities/user.entity';
import { SeederFactoryManager, setSeederFactory } from 'typeorm-extension';
import { Instructor } from '../../instructors/entities/instructor.entity';

export const InstructorFactory = setSeederFactory(
  Instructor,
  async (faker, context: Partial<Instructor> = {}) => {
    const user = new User({});
    const firstName = faker.person.firstName();
    user.name = `${firstName}`;
    user.email = `${firstName}@example.com`;
    user.password = faker.internet.password();
    const instructor = new Instructor({});
    // Use custom data if provided; otherwise, use faker defaults.
    instructor.user = context.user || user;

    return instructor;
  }
);
