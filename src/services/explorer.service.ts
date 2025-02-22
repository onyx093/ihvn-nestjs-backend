import { PERMISSION_METADATA } from '@/decorators/permission.decorator';
import { SUBJECT_METADATA } from '@/decorators/subject.decorator';
import { Permission } from '@/permissions/entities/permission.entity';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsExplorerService implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  /**
   * Scans all controllers, groups permission strings by the subject value.
   */
  public explorePermissions(): Record<string, string[]> {
    const permissionsBySubject: Record<string, string[]> = {};

    const controllers = this.discoveryService.getControllers();
    controllers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;
      // Retrieve the subject from the controller class
      const subject = this.reflector.get<string>(SUBJECT_METADATA, metatype);
      if (!subject) return;

      // Ensure there is an array for this subject
      if (!permissionsBySubject[subject]) {
        permissionsBySubject[subject] = [];
      }

      // Iterate over the controller’s prototype methods
      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype);
      methodNames.forEach((methodName) => {
        const method = prototype[methodName];
        if (typeof method !== 'function') return;
        const permission = this.reflector.get<string>(
          PERMISSION_METADATA,
          method
        );
        if (permission) {
          permissionsBySubject[subject].push(permission);
        }
      });
    });
    return permissionsBySubject;
  }

  /**
   * Persists permissions into the database.
   * This method should be idempotent – it can insert new permissions or update existing ones.
   */
  public async persistPermissions(): Promise<void> {
    const permissionsBySubject = this.explorePermissions();

    for (const subject of Object.keys(permissionsBySubject)) {
      const permissionList = permissionsBySubject[subject];
      for (const permission of permissionList) {
        // Check if the permission already exists
        const existing = await this.permissionRepository.findOne({
          where: { name: permission, subject },
        });
        if (!existing) {
          const newPermission = this.permissionRepository.create({
            name: permission,
            subject: subject,
          });
          await this.permissionRepository.save(newPermission);
        }
      }
    }
  }

  /**
   * Automatically called by Nest once the application is bootstrapped.
   * You can also call persistPermissions() elsewhere if needed.
   */
  async onApplicationBootstrap() {
    await this.persistPermissions();
  }
}
