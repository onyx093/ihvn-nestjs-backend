import { Account } from '../../users/entities/account.entity';
import { PredefinedRoles } from '../../enums/role.enum';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Student } from '../../students/entities/student.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    // You can pass an array of role settings for each user.

    const superAdminRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.SUPER_ADMIN,
    });

    const adminRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.ADMIN,
    });

    const editorRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.EDITOR,
    });

    const receptionistRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.RECEPTIONIST,
    });

    const studentRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.STUDENT,
    });

    const guestRole = await dataSource.getRepository(Role).findOneBy({
      name: PredefinedRoles.GUEST,
    });

    const superAdminUser = {
      name: 'John Doe',
      username: 'john',
      email: 'john@example.com',
      roles: [superAdminRole],
    };

    const adminUser = {
      name: 'Jane Doe',
      username: 'jane',
      email: 'jane@example.com',
      roles: [adminRole],
    };

    const editorUser = {
      name: 'Joseph Doe',
      username: 'joseph',
      email: 'joseph@example.com',
      roles: [editorRole],
    };

    const receptionistUser = {
      name: 'Winner Doe',
      username: 'winner',
      email: 'winner@example.com',
      roles: [receptionistRole],
    };

    const studentUser = {
      name: 'Jack Doe',
      username: 'jack',
      email: 'jack@example.com',
      roles: [studentRole],
    };

    const guestUser = {
      name: 'Jennifer Doe',
      username: 'jennifer',
      email: 'jennifer@example.com',
      roles: [guestRole],
    };

    // Repository managers
    const userRepository = dataSource.getRepository(User);
    const studentRepository = dataSource.getRepository(Student);

    const superAdminFactory = await factoryManager
      .get(User)
      .make(superAdminUser);
    superAdminFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: true,
      isAccountGenerated: true,
    });

    const adminFactory = await factoryManager.get(User).make(adminUser);
    adminFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: false,
      isAccountGenerated: false,
    });

    const editorFactory = await factoryManager.get(User).make(editorUser);
    editorFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: false,
      isAccountGenerated: false,
    });

    const receptionistFactory = await factoryManager
      .get(User)
      .make(receptionistUser);
    receptionistFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: true,
      isAccountGenerated: true,
    });

    const studentFactory = await factoryManager.get(User).make(studentUser);
    studentFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: true,
      isAccountGenerated: false,
    });

    const studentEntityFactory = await factoryManager.get(Student).make({
      user: studentFactory,
      referenceNumber: `IHVN-${new Date().getFullYear()}-001`,
    });

    const guestFactory = await factoryManager.get(User).make(guestUser);
    guestFactory.account = await factoryManager.get(Account).make({
      firstTimeLogin: true,
      isAccountGenerated: true,
    });

    await Promise.all([
      userRepository.save(superAdminFactory),
      userRepository.save(adminFactory),
      userRepository.save(editorFactory),
      userRepository.save(receptionistFactory),
      userRepository.save(studentFactory),
      userRepository.save(guestFactory),
    ]);

    await Promise.all([studentRepository.save(studentEntityFactory)]);
  }
}
