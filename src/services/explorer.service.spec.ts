import { DiscoveryService, Reflector } from '@nestjs/core';
import { PermissionsExplorerService } from './explorer.service';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';

describe('PermissionsExplorerService', () => {
  let service: PermissionsExplorerService;
  let discoveryService: DiscoveryService;
  let reflector: Reflector;
  let permissionRepo: Repository<Permission>;

  beforeEach(() => {
    // Mocks for discovery and reflector
    discoveryService = {
      getControllers: jest.fn(),
    } as any;
    reflector = new Reflector();

    // Mock repository with basic promise resolution.
    permissionRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    service = new PermissionsExplorerService(
      discoveryService,
      reflector,
      permissionRepo
    );
  });

  it('should group permissions by subject from controller metadata', () => {
    // Create two dummy controllers with metadata.
    const controllerInstance1 = { prototype: { method1: () => {} } };
    const controllerInstance2 = { prototype: { method2: () => {} } };

    class Controller1 {}
    class Controller2 {}

    // Attach subject metadata to controllers.
    Reflect.defineMetadata('SUBJECT_METADATA', 'Article', Controller1);
    Reflect.defineMetadata('SUBJECT_METADATA', 'User', Controller2);

    // Attach permission metadata to methods.
    Reflect.defineMetadata(
      'PERMISSION_METADATA',
      'read_articles',
      controllerInstance1.prototype.method1
    );
    Reflect.defineMetadata(
      'PERMISSION_METADATA',
      'read_users',
      controllerInstance2.prototype.method2
    );

    discoveryService.getControllers = jest.fn(() => [
      { instance: controllerInstance1, metatype: Controller1 },
      { instance: controllerInstance2, metatype: Controller2 },
    ]);

    const result = service.explorePermissions();
    expect(result).toEqual({
      Article: ['read_articles'],
      User: ['read_users'],
    });
  });

  it('should persist new permissions if not already in DB', async () => {
    // Setup a controller with one permission.
    const controllerInstance = { prototype: { method: () => {} } };
    class Controller {}
    Reflect.defineMetadata('SUBJECT_METADATA', 'Article', Controller);
    Reflect.defineMetadata(
      'PERMISSION_METADATA',
      'create_articles',
      controllerInstance.prototype.method
    );

    discoveryService.getControllers = jest.fn(() => [
      { instance: controllerInstance, metatype: Controller },
    ]);

    // Assume permission does not exist.
    permissionRepo.findOne.mockResolvedValue(null);
    permissionRepo.create.mockReturnValue({
      name: 'create_articles',
      subject: 'Article',
    });
    permissionRepo.save.mockResolvedValue({
      id: 1,
      name: 'create_articles',
      subject: 'Article',
    });

    await service.persistPermissions();

    expect(permissionRepo.findOne).toHaveBeenCalledWith({
      where: { name: 'create_articles', subject: 'Article' },
    });
    expect(permissionRepo.create).toHaveBeenCalledWith({
      name: 'create_articles',
      subject: 'Article',
    });
    expect(permissionRepo.save).toHaveBeenCalled();
  });
});
