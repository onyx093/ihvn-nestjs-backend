import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';

/* describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionsService],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); */

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionRepo: any;

  beforeEach(() => {
    permissionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new PermissionsService(permissionRepo);
  });

  it('should create a new permission', async () => {
    const dto = { name: 'read_articles', subject: 'Article' };
    const permission = { id: 1, ...dto };
    permissionRepo.create.mockReturnValue(permission);
    permissionRepo.save.mockResolvedValue(permission);

    const result = await service.create(dto);
    expect(permissionRepo.create).toHaveBeenCalledWith(dto);
    expect(permissionRepo.save).toHaveBeenCalledWith(permission);
    expect(result).toEqual(permission);
  });

  it('should find all permissions', async () => {
    const permissions = [{ id: 1, name: 'read_articles', subject: 'Article' }];
    permissionRepo.find.mockResolvedValue(permissions);

    const result = await service.findAll();
    expect(permissionRepo.find).toHaveBeenCalled();
    expect(result).toEqual(permissions);
  });

  it('should find one permission', async () => {
    const permission = { id: 1, name: 'read_articles', subject: 'Article' };
    permissionRepo.findOne.mockResolvedValue(permission);

    const result = await service.findOne(1);
    expect(permissionRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(permission);
  });

  it('should update a permission', async () => {
    const dto = { name: 'updated_permission' };
    permissionRepo.update.mockResolvedValue({});
    permissionRepo.findOne.mockResolvedValue({ id: 1, ...dto });

    const result = await service.update(1, dto);
    expect(permissionRepo.update).toHaveBeenCalledWith(1, dto);
    expect(permissionRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should delete a permission', async () => {
    permissionRepo.delete.mockResolvedValue({});
    await service.remove(1);
    expect(permissionRepo.delete).toHaveBeenCalledWith(1);
  });
});
