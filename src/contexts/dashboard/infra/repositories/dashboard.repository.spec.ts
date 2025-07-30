import { DashboardRepository } from './dashboard.repository';
import { DashboardFilterDto } from '../../presentation/dtos/get.dto';

describe('DashboardRepository', () => {
  let repository: DashboardRepository;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      farm: {
        count: jest.fn(),
        aggregate: jest.fn(),
        groupBy: jest.fn(),
        findMany: jest.fn(),
      },
      crop: {
        groupBy: jest.fn(),
      },
    };

    repository = new DashboardRepository(prismaMock);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return correct dashboard data', async () => {
    const filters: DashboardFilterDto = {
      producerId: 'uuid-producer',
      state: 'MG',
      cropName: 'Milho',
    };

    prismaMock.farm.count.mockResolvedValue(3);
    prismaMock.farm.aggregate.mockResolvedValue({
      _sum: {
        totalArea: 200,
        arableArea: 120,
        vegetationArea: 80,
      },
    });
    prismaMock.farm.groupBy.mockResolvedValue([
      { state: 'MG', _count: { state: 3 } },
    ]);
    prismaMock.farm.findMany.mockResolvedValue([
      { id: 'farm1' },
      { id: 'farm2' },
    ]);
    prismaMock.crop.groupBy.mockResolvedValue([
      { name: 'Milho', _count: { name: 2 } },
    ]);

    const result = await repository.getDashboardData(filters);

    expect(result).toEqual({
      totalFarms: 3,
      totalHectares: 200,
      farmsByState: [{ state: 'MG', count: 3 }],
      cropsDistribution: [{ name: 'Milho', count: 2 }],
      landUseDistribution: [
        { label: 'Área Agricultável', value: 120 },
        { label: 'Área de Vegetação', value: 80 },
      ],
    });
  });
});
