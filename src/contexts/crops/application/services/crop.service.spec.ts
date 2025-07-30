import { NotFoundException } from '@nestjs/common';
import { CreateCropDto } from '../../presentation/dtos/create.dto';
import { UpdateCropDto } from '../../presentation/dtos/update.dto';
import { CropFilterDto } from '../../presentation/dtos/get.dto';
import { CropEntity } from '../../commom/entities/crops.entities';
import { CropService } from './crops.service';

describe('CropService', () => {
  let service: CropService;
  let cropRepository: any;

  beforeEach(() => {
    cropRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    service = new CropService(cropRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call repository.create with dto', async () => {
      const dto: CreateCropDto = { name: 'Milho', farmId: 'farm-uuid', harvestId: 'harvest-uuid' };
      await service.create(dto);
      expect(cropRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return crops and total from repository', async () => {
      const filter: CropFilterDto = { name: 'milho', limit: 10, offset: 0 };
      const mockResult = { data: [], total: 0 };
      cropRepository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(filter);

      expect(cropRepository.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return crop when found', async () => {
      const crop: CropEntity = {
        id: 'crop-uuid',
        name: 'Milho',
        farmId: 'farm-uuid',
        harvestId: 'harvest-uuid',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      cropRepository.findOne.mockResolvedValue(crop);

      const result = await service.findOne('crop-uuid');

      expect(cropRepository.findOne).toHaveBeenCalledWith('crop-uuid');
      expect(result).toEqual(crop);
    });

    it('should throw NotFoundException if crop not found', async () => {
      cropRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(cropRepository.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should call repository.update and return updated crop', async () => {
      const dto: UpdateCropDto = { name: 'Milho Atualizado', farmId: 'farm-uuid', harvestId: 'harvest-uuid' };
      const updated: CropEntity = {
        id: 'crop-uuid',
        name: dto.name,
        farmId: dto.farmId,
        harvestId: dto.harvestId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      cropRepository.update.mockResolvedValue(updated);

      const result = await service.update('crop-uuid', dto);

      expect(cropRepository.update).toHaveBeenCalledWith('crop-uuid', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call repository.remove', async () => {
      cropRepository.remove.mockResolvedValue(undefined);

      await service.remove('crop-uuid');

      expect(cropRepository.remove).toHaveBeenCalledWith('crop-uuid');
    });
  });
});
