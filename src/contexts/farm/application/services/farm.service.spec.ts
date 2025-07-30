import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { IFarmRepository } from '../../infra/interfaces/farm.repository';
import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { FarmEntity } from '../../commom/entities/communication.entities';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockFarm = {
  id: 'uuid-farm-123',
  name: 'Fazenda Teste',
  city: 'Barretos',
  state: 'SP',
  totalArea: 100,
  arableArea: 40,
  vegetationArea: 30,
  producerId: 'uuid-prod-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFarmRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

describe('FarmService', () => {
  let service: FarmService;
  let repository: IFarmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: IFarmRepository,
          useValue: mockFarmRepository,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    repository = module.get<IFarmRepository>(IFarmRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm when area is consistent', async () => {
      const dto: CreateFarmDto = {
        name: 'Nova Fazenda',
        city: 'Barretos',
        state: 'SP',
        totalArea: 100,
        arableArea: 40,
        vegetationArea: 30,
        producerId: 'uuid-prod-123',
      };

      mockFarmRepository.create.mockResolvedValue(undefined);

      await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if arableArea + vegetationArea > totalArea', async () => {
      const dto: CreateFarmDto = {
        name: 'Nova Fazenda',
        city: 'Barretos',
        state: 'SP',
        totalArea: 50,
        arableArea: 40,
        vegetationArea: 20,
        producerId: 'uuid-prod-123',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the updated farm when area is consistent', async () => {
      const dto: UpdateFarmDto = {
        totalArea: 150,
        arableArea: 50,
        vegetationArea: 40,
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.update.mockResolvedValue({ ...mockFarm, ...dto });

      const result = await service.update('uuid-farm-123', dto);

      expect(repository.findOne).toHaveBeenCalledWith('uuid-farm-123');
      expect(repository.update).toHaveBeenCalledWith('uuid-farm-123', dto);
      expect(result.totalArea).toBe(dto.totalArea);
    });

    it('should throw NotFoundException if farm not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      const dto: UpdateFarmDto = { totalArea: 100 };

      await expect(service.update('invalid-id', dto)).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if new areas are inconsistent', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      const dto: UpdateFarmDto = {
        totalArea: 60,
        arableArea: 40,
        vegetationArea: 30,
      };

      await expect(service.update('uuid-farm-123', dto)).rejects.toThrow(BadRequestException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return farms with pagination and filters', async () => {
      const filter = { city: 'Barretos', limit: 10, offset: 0 };

      const returnData = { data: [mockFarm], total: 1 };
      mockFarmRepository.findAll.mockResolvedValue(returnData);

      const result = await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(returnData);
    });
  });

  describe('findOne', () => {
    it('should return a farm if found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      const result = await service.findOne('uuid-farm-123');

      expect(repository.findOne).toHaveBeenCalledWith('uuid-farm-123');
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      mockFarmRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call repository.remove', async () => {
      mockFarmRepository.remove.mockResolvedValue(undefined);

      await service.remove('uuid-farm-123');

      expect(repository.remove).toHaveBeenCalledWith('uuid-farm-123');
    });
  });
});
