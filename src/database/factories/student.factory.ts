import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
import { SeederFactoryManager, setSeederFactory } from 'typeorm-extension';

export const StudentFactory = setSeederFactory(
  Student,
  async (faker, context: Partial<Student> = {}) => {
    const user = new User({});
    const firstName = faker.person.firstName();
    user.name = `${firstName}`;
    user.email = `${firstName}@example.com`;
    user.password = faker.internet.password();
    const student = new Student({});
    // Use custom data if provided; otherwise, use faker defaults.
    student.user = context.user || user;

    return student;
  }
);
