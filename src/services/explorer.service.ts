import { PERMISSION_METADATA } from '../decorators/permission.decorator';
import { SUBJECT_METADATA } from '../decorators/subject.decorator';
import {
  Admin,
  Editor,
  Guest,
  Instructor,
  Receptionist,
  Student,
  SuperAdmin,
} from '../enums/role.enum';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsExplorerService implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
        try {
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
        } catch (error) {}
      }
    }
  }

  /**
   * Persists roles into the database.
   * This method should be idempotent – it can insert new roles or update existing ones.
   */

  public async persistRoles() {
    // Array of role objects you want to persist
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
      // For each permission in the role's permissions array, fetch the matching Permission entity
      const permissions = await Promise.all(
        role.permissions.map(async (permObj) => {
          const permissionEntity = await this.permissionRepository.findOne({
            where: { name: permObj.action, subject: permObj.subject },
          });
          if (!permissionEntity) {
            throw new Error(
              `Permission is not found for action "${permObj.action}" and subject "${permObj.subject}"`
            );
          }
          return permissionEntity;
        })
      );

      // Check if the role already exists.
      let roleEntity = await this.roleRepository.findOne({
        where: { name: role.roleName },
      });

      if (roleEntity) {
        // If the role exists, update its permissions (or merge new permissions as needed).
        roleEntity.permissions = permissions;
        console.log(`Updating existing role: ${roleEntity.name}`);
      } else {
        // Otherwise, create a new role entity and assign the fetched permissions.
        roleEntity = await this.roleRepository.create();
        roleEntity.name = role.roleName;
        roleEntity.type = role.type;
        roleEntity.permissions = permissions;
        console.log(`Creating new role: ${roleEntity.name}`);
      }

      // Save (insert or update) the role entity.
      await this.roleRepository.save(roleEntity);
    }
  }

  /**
   * Automatically called by Nest once the application is bootstrapped.
   * You can also call persistPermissions() elsewhere if needed
   */
  async onApplicationBootstrap() {
    // await this.persistPermissions();
    // await this.persistRoles();
  }
}
