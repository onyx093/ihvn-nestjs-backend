import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

/* describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
}); */

describe('RolesController', () => {
  let controller: RolesController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      assignPermissions: jest.fn(),
    };
    controller = new RolesController(service);
  });

  it('should create a role', async () => {
    const dto = { name: 'Admin' };
    service.create.mockResolvedValue(dto);
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all roles', async () => {
    const roles = [{ id: 1, name: 'Admin' }];
    service.findAll.mockResolvedValue(roles);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(roles);
  });

  it('should find one role', async () => {
    const role = { id: 1, name: 'Admin' };
    service.findOne.mockResolvedValue(role);
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(role);
  });

  it('should update a role', async () => {
    const dto = { name: 'SuperAdmin' };
    service.update.mockResolvedValue(dto);
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(dto);
  });

  it('should delete a role', async () => {
    service.remove.mockResolvedValue(null);
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeNull();
  });

  it('should assign permissions to a role', async () => {
    const permissionIds = [1, 2];
    const role = { id: 1, permissions: [] };
    service.assignPermissions.mockResolvedValue(role);
    const result = await controller.assignPermissions(1, permissionIds);
    expect(service.assignPermissions).toHaveBeenCalledWith(1, permissionIds);
    expect(result).toEqual(role);
  });
});
