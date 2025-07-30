import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from './harvest.service';
import { IHarvestRepository } from '../../infra/interfaces/harvest.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

describe('HarvestService', () => {
  let service: HarvestService;
  let repository: jest.Mocked<IHarvestRepository>;

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        { provide: IHarvestRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<IHarvestRepository>(IHarvestRepository) as jest.Mocked<IHarvestRepository>;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call repository.create with dto', async () => {
      const dto: CreateHarvestDto = { year: 2025 };
      repository.create.mockResolvedValue();

      await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return the result from repository.findAll', async () => {
      const filter: HarvestFilterDto = { year: 2025 };
      const result = {
        data: [{ id: '1', year: 2025, createdAt: new Date(), updatedAt: new Date() }],
        total: 1,
      };
      repository.findAll.mockResolvedValue(result);

      const res = await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
      expect(res).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return the harvest if found', async () => {
      const harvest: HarvestEntity = { id: '1', year: 2025, createdAt: new Date(), updatedAt: new Date() };
      repository.findOne.mockResolvedValue(harvest);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(harvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith('nonexistent-id');
    });
  });

  describe('update', () => {
    it('should call repository.update and return updated harvest', async () => {
      const dto: UpdateHarvestDto = { year: 2026 };
      const updatedHarvest: HarvestEntity = { id: '1', year: 2026, createdAt: new Date(), updatedAt: new Date() };
      repository.update.mockResolvedValue(updatedHarvest);

      const result = await service.update('1', dto);

      expect(repository.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updatedHarvest);
    });
  });

  describe('remove', () => {
    it('should call repository.remove with the given id', async () => {
      repository.remove.mockResolvedValue();

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith('1');
    });
  });
});
