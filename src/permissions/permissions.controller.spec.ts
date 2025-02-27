import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

/* describe('PermissionsController', () => {
  let controller: PermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [PermissionsService],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
}); */

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: any;

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new PermissionsController(service);
  });

  it('should create a permission', async () => {
    const dto = { name: 'read_articles', subject: 'Article' };
    service.create.mockResolvedValue(dto);
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('should find all permissions', async () => {
    const permissions = [{ id: 1, name: 'read_articles', subject: 'Article' }];
    service.findAll.mockResolvedValue(permissions);
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(permissions);
  });

  it('should find one permission', async () => {
    const permission = { id: 1, name: 'read_articles', subject: 'Article' };
    service.findOne.mockResolvedValue(permission);
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(permission);
  });

  it('should update a permission', async () => {
    const dto = { name: 'updated_permission' };
    service.update.mockResolvedValue(dto);
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(dto);
  });

  it('should delete a permission', async () => {
    service.remove.mockResolvedValue(null);
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toBeNull();
  });
});
