import { PredefinedRoles } from '../../enums/role.enum';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

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
      roles: [superAdminRole, receptionistRole],
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

    const userRepository = dataSource.getRepository(User);

    const superAdminFactory = await factoryManager
      .get(User)
      .make(superAdminUser);
    await userRepository.save(superAdminFactory);

    const adminFactory = await factoryManager.get(User).make(adminUser);
    await userRepository.save(adminFactory);

    const editorFactory = await factoryManager.get(User).make(editorUser);
    await userRepository.save(editorFactory);

    const receptionistFactory = await factoryManager
      .get(User)
      .make(receptionistUser);
    await userRepository.save(receptionistFactory);

    const studentFactory = await factoryManager.get(User).make(studentUser);
    await userRepository.save(studentFactory);

    const guestFactory = await factoryManager.get(User).make(guestUser);
    await userRepository.save(guestFactory);
  }
}
