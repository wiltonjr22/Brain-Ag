import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { IFarmService } from '../../application/interfaces/farm.service';
import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { FarmFilterDto } from '../../presentation/dtos/get.dto';
import { NotFoundException } from '@nestjs/common';

const mockFarm = {
  id: 'uuid-farm-123',
  name: 'Fazenda Teste',
  city: 'Cidade Teste',
  state: 'Estado Teste',
  totalArea: 100,
  arableArea: 30,
  vegetationArea: 20,
  producerId: 'uuid-producer-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockFarmService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FarmController', () => {
  let controller: FarmController;
  let service: IFarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: IFarmService,
          useValue: mockFarmService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<IFarmService>(IFarmService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm', async () => {
      const dto: CreateFarmDto = {
        name: 'Fazenda Nova',
        city: 'Cidade Nova',
        state: 'Estado Nova',
        totalArea: 150,
        arableArea: 50,
        vegetationArea: 50,
        producerId: 'uuid-producer-123',
      };

      mockFarmService.create.mockResolvedValue(undefined);

      await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of farms', async () => {
      const filter: FarmFilterDto = { city: 'Cidade Teste' };
      const returnData = { data: [mockFarm], total: 1 };

      mockFarmService.findAll.mockResolvedValue(returnData);

      const result = await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(returnData);
    });
  });

  describe('findOne', () => {
    it('should return a farm by ID', async () => {
      mockFarmService.findOne.mockResolvedValue(mockFarm);

      const result = await controller.findOne('uuid-farm-123');

      expect(service.findOne).toHaveBeenCalledWith('uuid-farm-123');
      expect(result).toEqual(mockFarm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      mockFarmService.findOne.mockImplementation(() => {
        throw new NotFoundException('Farm not found');
      });

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should update and return the updated farm', async () => {
      const dto: UpdateFarmDto = { name: 'Fazenda Atualizada' };
      const updatedFarm = { ...mockFarm, ...dto };

      mockFarmService.update.mockResolvedValue(updatedFarm);

      const result = await controller.update('uuid-farm-123', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-farm-123', dto);
      expect(result.name).toBe(dto.name);
    });
  });

  describe('remove', () => {
    it('should call service to remove the farm', async () => {
      mockFarmService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-farm-123');

      expect(service.remove).toHaveBeenCalledWith('uuid-farm-123');
      expect(result).toBeUndefined();
    });
  });
});
