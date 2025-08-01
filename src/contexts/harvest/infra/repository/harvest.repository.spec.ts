import { Test, TestingModule } from '@nestjs/testing';
import { HarvestRepository } from './harvest.repository';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';

describe('HarvestRepository', () => {
  let repository: HarvestRepository;
  let prisma: any;

  beforeEach(async () => {
    const prismaMock = {
      harvest: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      crop: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    repository = module.get<HarvestRepository>(HarvestRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call prisma.harvest.create with correct data', async () => {
      const dto: CreateHarvestDto = { year: 2025 };
      prisma.harvest.create.mockResolvedValue(undefined);

      await repository.create(dto);

      expect(prisma.harvest.create).toHaveBeenCalledWith({
        data: { year: dto.year },
      });
    });
  });

  describe('findAll', () => {
    it('should call prisma.harvest.findMany and count with correct filters', async () => {
      const filter: HarvestFilterDto = { year: 2025, limit: 5, offset: 0 };
      const rawData = [
        { id: '1', year: 2025, createdAt: new Date(), updatedAt: new Date() },
      ];
      const total = 1;

      prisma.harvest.findMany.mockResolvedValue(rawData);
      prisma.harvest.count.mockResolvedValue(total);

      const result = await repository.findAll(filter);

      expect(prisma.harvest.findMany).toHaveBeenCalledWith({
        where: { year: 2025 },
        skip: 0,
        take: 5,
        orderBy: { year: 'desc' },
      });

      expect(prisma.harvest.count).toHaveBeenCalledWith({ where: { year: 2025 } });

      expect(result).toEqual({
        data: rawData.map(r => ({
          id: r.id,
          year: r.year,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })),
        total,
      });
    });
  });

  describe('findOne', () => {
    it('should return entity when found', async () => {
      const id = 'uuid-harvest';
      const rawData = { id, year: 2025, createdAt: new Date(), updatedAt: new Date() };

      prisma.harvest.findUnique.mockResolvedValue(rawData);

      const result = await repository.findOne(id);

      expect(prisma.harvest.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual({
        id: rawData.id,
        year: rawData.year,
        createdAt: rawData.createdAt,
        updatedAt: rawData.updatedAt,
      });
    });

    it('should return null when not found', async () => {
      prisma.harvest.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should call prisma.harvest.update and return updated entity', async () => {
      const id = 'uuid-harvest';
      const dto: UpdateHarvestDto = { year: 2026 };
      const updatedRaw = { id, year: 2026, createdAt: new Date(), updatedAt: new Date() };

      prisma.harvest.update.mockResolvedValue(updatedRaw);

      const result = await repository.update(id, dto);

      expect(prisma.harvest.update).toHaveBeenCalledWith({ where: { id }, data: dto });
      expect(result).toEqual({
        id: updatedRaw.id,
        year: updatedRaw.year,
        createdAt: updatedRaw.createdAt,
        updatedAt: updatedRaw.updatedAt,
      });
    });
  });

  describe('remove', () => {
    it('should call prisma.harvest.delete with correct id when no crops exist', async () => {
      const id = 'uuid-harvest';

      prisma.crop.findMany.mockResolvedValue([]); // ✅ sem culturas associadas
      prisma.harvest.delete.mockResolvedValue(undefined);

      await repository.remove(id);

      expect(prisma.crop.findMany).toHaveBeenCalledWith({ where: { harvestId: id } });
      expect(prisma.harvest.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw error when crops are associated with the harvest', async () => {
      const id = 'uuid-harvest';

      prisma.crop.findMany.mockResolvedValue([{ id: 'crop-1' }]); // ✅ com cultura associada

      await expect(repository.remove(id)).rejects.toThrowError(
        `Cannot delete harvest with ID ${id} because it has associated crops`,
      );

      expect(prisma.harvest.delete).not.toHaveBeenCalled();
    });
  });
});
