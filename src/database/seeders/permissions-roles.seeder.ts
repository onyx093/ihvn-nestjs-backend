import {
  Admin,
  Editor,
  Guest,
  Instructor,
  Receptionist,
  Student,
  SuperAdmin,
} from '../../enums/role.enum';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { PermissionsExplorerService } from '../../services/explorer.service';

export default class PermissionsRolesSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const permissionRepository = dataSource.getRepository(Permission);
    const roleRepository = dataSource.getRepository(Role);

    // Set environment variable to ensure app uses the same host as seeder
    process.env.DB_HOST = (dataSource.options as any).host;
    process.env.SEEDER_CONTEXT = 'true';

    // Create NestJS application context to get the service
    const app = await NestFactory.createApplicationContext(AppModule);

    try {
      const permissionsExplorerService = app.get(PermissionsExplorerService);

      // Seed permissions using the service
      await this.seedPermissions(
        permissionsExplorerService,
        permissionRepository
      );

      // Seed roles using the service
      await this.seedRoles(
        permissionsExplorerService,
        roleRepository,
        permissionRepository
      );
    } finally {
      delete process.env.SEEDER_CONTEXT;
      await app.close();
    }
  }

  private async seedPermissions(
    permissionsExplorerService: PermissionsExplorerService,
    permissionRepository: any
  ): Promise<void> {
    const permissionsBySubject =
      permissionsExplorerService.explorePermissions();

    for (const subject of Object.keys(permissionsBySubject)) {
      const permissionList = permissionsBySubject[subject];
      for (const permission of permissionList) {
        const existing = await permissionRepository.findOne({
          where: { name: permission, subject },
        });
        if (!existing) {
          const newPermission = permissionRepository.create({
            name: permission,
            subject: subject,
          });
          await permissionRepository.save(newPermission);
          console.log(`Created permission: ${permission} on ${subject}`);
        }
      }
    }
  }

  private async seedRoles(
    permissionsExplorerService: PermissionsExplorerService,
    roleRepository: any,
    permissionRepository: any
  ): Promise<void> {
    const roles = [
      SuperAdmin,
      Admin,
      Editor,
      Instructor,
      Receptionist,
      Student,
      Guest,
    ];

    for (const role of roles) {
      // Check if role already exists
      let roleEntity = await roleRepository.findOne({
        where: { name: role.roleName },
      });

      // Get permissions for this role
      const permissions = await Promise.all(
        role.permissions.map(async (permObj) => {
          const permissionEntity = await permissionRepository.findOne({
            where: { name: permObj.action, subject: permObj.subject },
          });
          if (!permissionEntity) {
            throw new Error(
              `Permission not found for action "${permObj.action}" and subject "${permObj.subject}"`
            );
          }
          return permissionEntity;
        })
      );

      if (roleEntity) {
        // Update existing role
        roleEntity.permissions = permissions;
        roleEntity.type = role.type;
        console.log(`Updating existing role: ${roleEntity.name}`);
      } else {
        // Create new role
        roleEntity = roleRepository.create({
          name: role.roleName,
          type: role.type,
          permissions: permissions,
        });
        console.log(`Creating new role: ${role.roleName}`);
      }

      await roleRepository.save(roleEntity);
    }
  }
}
