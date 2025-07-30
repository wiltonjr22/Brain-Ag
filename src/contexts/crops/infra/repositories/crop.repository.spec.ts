import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateCropDto } from '../../presentation/dtos/create.dto';
import { UpdateCropDto } from '../../presentation/dtos/update.dto';
import { CropFilterDto } from '../../presentation/dtos/get.dto';
import { CropRepository } from './crops.repository';

describe('CropRepository', () => {
  let repository: CropRepository;
  let prisma: PrismaService;

  const mockPrisma = {
    crop: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    prisma = mockPrisma as unknown as PrismaService;
    repository = new CropRepository(prisma);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a crop', async () => {
      const dto: CreateCropDto = {
        name: 'Milho',
        farmId: 'uuid-farm',
        harvestId: 'uuid-harvest',
      };

      mockPrisma.crop.create.mockResolvedValue(undefined);

      await repository.create(dto);

      expect(mockPrisma.crop.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          farmId: dto.farmId,
          harvestId: dto.harvestId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should find crops with filters and return data and total', async () => {
      const filter: CropFilterDto = {
        name: 'milho',
        farmId: 'uuid-farm',
        harvestId: 'uuid-harvest',
        limit: 5,
        offset: 0,
      };

      const rawData = [
        {
          id: 'uuid-1',
          name: 'Milho',
          farmId: 'uuid-farm',
          harvestId: 'uuid-harvest',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.crop.findMany.mockResolvedValue(rawData);
      mockPrisma.crop.count.mockResolvedValue(rawData.length);

      const result = await repository.findAll(filter);

      expect(mockPrisma.crop.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: filter.name, mode: 'insensitive' },
          farmId: filter.farmId,
          harvestId: filter.harvestId,
        },
        skip: filter.offset,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
      });

      expect(mockPrisma.crop.count).toHaveBeenCalledWith({
        where: {
          name: { contains: filter.name, mode: 'insensitive' },
          farmId: filter.farmId,
          harvestId: filter.harvestId,
        },
      });

      expect(result.data.length).toBe(rawData.length);
      expect(result.total).toBe(rawData.length);
    });
  });

  describe('findOne', () => {
    it('should return a crop entity if found', async () => {
      const data = {
        id: 'uuid-crop',
        name: 'Milho',
        farmId: 'uuid-farm',
        harvestId: 'uuid-harvest',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.crop.findUnique.mockResolvedValue(data);

      const result = await repository.findOne('uuid-crop');

      expect(mockPrisma.crop.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid-crop' } });
      expect(result).toEqual({
        id: data.id,
        name: data.name,
        farmId: data.farmId,
        harvestId: data.harvestId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    it('should return null if crop not found', async () => {
      mockPrisma.crop.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('invalid-id');

      expect(mockPrisma.crop.findUnique).toHaveBeenCalledWith({ where: { id: 'invalid-id' } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated crop entity', async () => {
      const dto: UpdateCropDto = {
        name: 'Milho Atualizado',
        farmId: 'uuid-farm',
        harvestId: 'uuid-harvest',
      };

      const updatedData = {
        id: 'uuid-crop',
        name: dto.name,
        farmId: dto.farmId,
        harvestId: dto.harvestId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.crop.update.mockResolvedValue(updatedData);

      const result = await repository.update('uuid-crop', dto);

      expect(mockPrisma.crop.update).toHaveBeenCalledWith({
        where: { id: 'uuid-crop' },
        data: {
          name: dto.name,
          farmId: dto.farmId,
          harvestId: dto.harvestId,
        },
      });

      expect(result).toEqual({
        id: updatedData.id,
        name: updatedData.name,
        farmId: updatedData.farmId,
        harvestId: updatedData.harvestId,
        createdAt: updatedData.createdAt,
        updatedAt: updatedData.updatedAt,
      });
    });
  });

  describe('remove', () => {
    it('should delete crop', async () => {
      mockPrisma.crop.delete.mockResolvedValue(undefined);

      await repository.remove('uuid-crop');

      expect(mockPrisma.crop.delete).toHaveBeenCalledWith({ where: { id: 'uuid-crop' } });
    });
  });
});
