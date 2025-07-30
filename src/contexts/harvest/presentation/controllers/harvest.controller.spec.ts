import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from './harvest.controller';
import { IHarvestService } from '../../application/interfaces/harvest.service';
import { CreateHarvestDto } from '../dtos/create.dto';
import { UpdateHarvestDto } from '../dtos/update.dto';
import { HarvestFilterDto } from '../dtos/get.dto';
import { NotFoundException } from '@nestjs/common';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

const mockHarvest: HarvestEntity = {
  id: 'uuid-harvest-1',
  year: 2025,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHarvestService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('HarvestController', () => {
  let controller: HarvestController;
  let service: IHarvestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [
        {
          provide: IHarvestService,
          useValue: mockHarvestService,
        },
      ],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<IHarvestService>(IHarvestService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call create and return void', async () => {
      const dto: CreateHarvestDto = { year: 2025 };

      mockHarvestService.create.mockResolvedValue(undefined);

      await expect(controller.create(dto)).resolves.toBeUndefined();
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return list of harvests', async () => {
      const filter: HarvestFilterDto = { year: 2025, limit: 10, offset: 0 };
      const returnData = { data: [mockHarvest], total: 1 };

      mockHarvestService.findAll.mockResolvedValue(returnData);

      const result = await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(returnData);
    });
  });

  describe('findOne', () => {
    it('should return a harvest if found', async () => {
      mockHarvestService.findOne.mockResolvedValue(mockHarvest);

      const result = await controller.findOne('uuid-harvest-1');

      expect(service.findOne).toHaveBeenCalledWith('uuid-harvest-1');
      expect(result).toEqual(mockHarvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should update and return the updated harvest', async () => {
      const dto: UpdateHarvestDto = { year: 2026 };
      const updatedHarvest = { ...mockHarvest, ...dto };

      mockHarvestService.update.mockResolvedValue(updatedHarvest);

      const result = await controller.update('uuid-harvest-1', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-harvest-1', dto);
      expect(result).toEqual(updatedHarvest);
    });
  });

  describe('remove', () => {
    it('should call remove and resolve void', async () => {
      mockHarvestService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('uuid-harvest-1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('uuid-harvest-1');
    });
  });
});
