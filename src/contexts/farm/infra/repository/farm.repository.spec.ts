import { Test, TestingModule } from '@nestjs/testing';
import { FarmRepository } from './farm.repository';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { FarmFilterDto } from '../../presentation/dtos/get.dto';

const mockPrismaService = {
  farm: {
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


describe('FarmRepository', () => {
  let repository: FarmRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService as unknown as PrismaService,
        },
      ],
    }).compile();

    repository = module.get<FarmRepository>(FarmRepository);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm', async () => {
      const dto: CreateFarmDto = {
        name: 'Fazenda Teste',
        city: 'Cidade',
        state: 'ST',
        totalArea: 1000,
        arableArea: 400,
        vegetationArea: 500,
        producerId: 'uuid-produtor',
      };

      prisma.farm.create.mockResolvedValue(undefined);

      await expect(repository.create(dto)).resolves.toBeUndefined();
      expect(prisma.farm.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return farms and total count', async () => {
      const filter: FarmFilterDto = {
        limit: 10,
        offset: 0,
        producerId: 'uuid-produtor',
      };

      const fakeFarms = [
        {
          id: 'uuid-1',
          name: 'Fazenda 1',
          city: 'Cidade 1',
          state: 'ST1',
          totalArea: 100,
          arableArea: 50,
          vegetationArea: 30,
          producerId: 'uuid-produtor',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prisma.farm.findMany.mockResolvedValue(fakeFarms);
      prisma.farm.count.mockResolvedValue(1);

      const result = await repository.findAll(filter);

      expect(prisma.farm.findMany).toHaveBeenCalledWith({
        where: { producerId: filter.producerId },
        skip: filter.offset,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
      });

      expect(prisma.farm.count).toHaveBeenCalledWith({ where: { producerId: filter.producerId } });

      expect(result).toEqual({
        data: fakeFarms.map(farm => ({
          id: farm.id,
          name: farm.name,
          city: farm.city,
          state: farm.state,
          totalArea: farm.totalArea,
          arableArea: farm.arableArea,
          vegetationArea: farm.vegetationArea,
          producerId: farm.producerId,
          createdAt: farm.createdAt,
          updatedAt: farm.updatedAt,
        })),
        total: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a farm if found', async () => {
      const farmData = {
        id: 'uuid-1',
        name: 'Fazenda 1',
        city: 'Cidade 1',
        state: 'ST1',
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 30,
        producerId: 'uuid-produtor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.farm.findUnique.mockResolvedValue(farmData);

      const result = await repository.findOne('uuid-1');

      expect(prisma.farm.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(result).toEqual(farmData);
    });

    it('should return null if farm not found', async () => {
      prisma.farm.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('uuid-invalido');

      expect(prisma.farm.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid-invalido' } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated farm', async () => {
      const updateDto: UpdateFarmDto = {
        name: 'Fazenda Atualizada',
      };

      const updatedFarm = {
        id: 'uuid-1',
        name: updateDto.name,
        city: 'Cidade 1',
        state: 'ST1',
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 30,
        producerId: 'uuid-produtor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.farm.update.mockResolvedValue(updatedFarm);

      const result = await repository.update('uuid-1', updateDto);

      expect(prisma.farm.update).toHaveBeenCalledWith({ where: { id: 'uuid-1' }, data: updateDto });
      expect(result).toEqual(updatedFarm);
    });
  });

  describe('remove', () => {
    it('should delete the farm if it has no crops', async () => {
      prisma.crop.findMany.mockResolvedValue([]);
      prisma.farm.delete.mockResolvedValue(undefined);

    await expect(repository.remove('uuid-1')).resolves.toBeUndefined();

    expect(prisma.crop.findMany).toHaveBeenCalledWith({ where: { farmId: 'uuid-1' } });
    expect(prisma.farm.delete).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
  });

    it('should throw an error if farm has associated crops', async () => {
      prisma.crop.findMany.mockResolvedValue([{ id: 'crop-1' }]);

      await expect(repository.remove('uuid-1')).rejects.toThrow(
        'Cannot delete farm with ID uuid-1 because it has associated crops'
      );

      expect(prisma.crop.findMany).toHaveBeenCalledWith({ where: { farmId: 'uuid-1' } });
      expect(prisma.farm.delete).not.toHaveBeenCalled();
  });
  });

});
