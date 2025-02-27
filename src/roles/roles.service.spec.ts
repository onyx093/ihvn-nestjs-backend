import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';

/* describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}); */

describe('RolesService', () => {
  let service: RolesService;
  let roleRepo: any;
  let permissionRepo: any;

  beforeEach(() => {
    roleRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    permissionRepo = {
      findByIds: jest.fn(),
    };

    service = new RolesService(roleRepo, permissionRepo);
  });

  it('should create a new role', async () => {
    const dto = { name: 'Admin' };
    const role = { id: 1, ...dto, permissions: [] };
    roleRepo.create.mockReturnValue(role);
    roleRepo.save.mockResolvedValue(role);

    const result = await service.create(dto);
    expect(roleRepo.create).toHaveBeenCalledWith(dto);
    expect(roleRepo.save).toHaveBeenCalledWith(role);
    expect(result).toEqual(role);
  });

  it('should find all roles with permissions', async () => {
    const roles = [{ id: 1, name: 'Admin', permissions: [] }];
    roleRepo.find.mockResolvedValue(roles);

    const result = await service.findAll();
    expect(roleRepo.find).toHaveBeenCalledWith({ relations: ['permissions'] });
    expect(result).toEqual(roles);
  });

  it('should find one role with permissions', async () => {
    const role = { id: 1, name: 'Admin', permissions: [] };
    roleRepo.findOne.mockResolvedValue(role);

    const result = await service.findOne(1);
    expect(roleRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['permissions'],
    });
    expect(result).toEqual(role);
  });

  it('should update a role', async () => {
    const dto = { name: 'SuperAdmin' };
    roleRepo.update.mockResolvedValue({});
    roleRepo.findOne.mockResolvedValue({ id: 1, ...dto, permissions: [] });

    const result = await service.update(1, dto);
    expect(roleRepo.update).toHaveBeenCalledWith(1, dto);
    expect(roleRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['permissions'],
    });
    expect(result).toEqual({ id: 1, ...dto, permissions: [] });
  });

  it('should delete a role', async () => {
    roleRepo.delete.mockResolvedValue({});
    await service.remove(1);
    expect(roleRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should assign permissions to a role', async () => {
    const role = { id: 1, name: 'Admin', permissions: [] };
    const permissions = [{ id: 1, name: 'read_articles', subject: 'Article' }];
    roleRepo.findOne.mockResolvedValue(role);
    permissionRepo.findByIds.mockResolvedValue(permissions);
    roleRepo.save.mockResolvedValue({ ...role, permissions });

    const result = await service.assignPermissions(1, [1]);
    expect(roleRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['permissions'],
    });
    expect(permissionRepo.findByIds).toHaveBeenCalledWith([1]);
    expect(roleRepo.save).toHaveBeenCalledWith({ ...role, permissions });
    expect(result).toEqual({ ...role, permissions });
  });
});
