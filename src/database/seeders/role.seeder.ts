import { Role } from '../../roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const roleEntity = new Role({
      name: 'Moderator',
      permissions: [],
    });
    const roleRepository = dataSource.getRepository(Role);
    const roleFactory = await factoryManager.get(Role).save(roleEntity);
    await roleRepository.save(roleFactory);
  }
}
