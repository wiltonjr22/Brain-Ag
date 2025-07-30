import { Test, TestingModule } from '@nestjs/testing';
import { CropController } from './crop.controller';
import { ICropService } from '../../application/interfaces/crops.service';
import { CreateCropDto } from '../dtos/create.dto';
import { UpdateCropDto } from '../dtos/update.dto';
import { CropFilterDto } from '../dtos/get.dto';
import { NotFoundException } from '@nestjs/common';
import { CropEntity } from '../../commom/entities/crops.entities';

const mockCrop = {
  id: 'uuid-crop-123',
  name: 'Milho',
  farmId: 'uuid-farm-123',
  harvestId: 'uuid-harvest-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCropService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CropController', () => {
  let controller: CropController;
  let service: ICropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: ICropService,
          useValue: mockCropService,
        },
      ],
    }).compile();

    controller = module.get<CropController>(CropController);
    service = module.get<ICropService>(ICropService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateCropDto = {
        name: 'Milho',
        farmId: 'uuid-farm-123',
        harvestId: 'uuid-harvest-123',
      };

      mockCropService.create.mockResolvedValue(undefined);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return crops', async () => {
      const filter: CropFilterDto = { name: 'Milho' };
      const returnData = { data: [mockCrop], total: 1 };

      mockCropService.findAll.mockResolvedValue(returnData);

      const result = await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(returnData);
    });
  });

  describe('findOne', () => {
    it('should return crop if found', async () => {
      mockCropService.findOne.mockResolvedValue(mockCrop);

      const result = await controller.findOne('uuid-crop-123');

      expect(service.findOne).toHaveBeenCalledWith('uuid-crop-123');
      expect(result).toEqual(mockCrop);
    });

    it('should throw NotFoundException if crop not found', async () => {
      mockCropService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should update and return updated crop', async () => {
      const dto: UpdateCropDto = { name: 'Milho Atualizado' };
      const updated = { ...mockCrop, ...dto };

      mockCropService.update.mockResolvedValue(updated);

      const result = await controller.update('uuid-crop-123', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-crop-123', dto);
      expect(result.name).toBe(dto.name);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockCropService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-crop-123');

      expect(service.remove).toHaveBeenCalledWith('uuid-crop-123');
      expect(result).toBeUndefined();
    });
  });
});
