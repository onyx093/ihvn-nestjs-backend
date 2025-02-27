import { Permission } from '../../permissions/entities/permission.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class PermissionSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const permissionEntity = new Permission({
      name: 'drive_cars',
      subject: 'Car',
      roles: [],
    });
    const permissionRepository = dataSource.getRepository(Permission);
    const permissionFactory = await factoryManager
      .get(Permission)
      .make(permissionEntity);
    await permissionRepository.save(permissionFactory);
  }
}
