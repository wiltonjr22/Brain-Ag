import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto, DashboardResponseDto } from '../../presentation/dtos/get.dto';
import { IDashboardRepository } from '../../infra/interfaces/dashboard.repository';

describe('DashboardService', () => {
  let service: DashboardService;
  let repository: IDashboardRepository;

  const mockDashboardRepository = {
    getDashboardData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: IDashboardRepository,
          useValue: mockDashboardRepository, // mocka o repo para evitar circular
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    repository = module.get<IDashboardRepository>(IDashboardRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct dashboard data', async () => {
    const filters: DashboardFilterDto = { state: 'SP' };
    const expectedResult: DashboardResponseDto = {
      totalFarms: 3,
      totalHectares: 200,
      farmsByState: [{ state: 'SP', count: 3 }],
      cropsDistribution: [{ name: 'Milho', count: 2 }],
      landUseDistribution: [
        { label: 'Área Agricultável', value: 120 },
        { label: 'Área de Vegetação', value: 80 },
      ],
    };

    mockDashboardRepository.getDashboardData.mockResolvedValue(expectedResult);

    const result = await service.getDashboard(filters);
    expect(result).toEqual(expectedResult);
    expect(mockDashboardRepository.getDashboardData).toHaveBeenCalledWith(filters);
  });
});
