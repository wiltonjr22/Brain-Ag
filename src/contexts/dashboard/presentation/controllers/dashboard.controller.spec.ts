import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { IDashboardService } from '../../application/interfaces/dashboard.service';
import { DashboardFilterDto, DashboardResponseDto } from '../../presentation/dtos/get.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: IDashboardService;

  const mockDashboardService = {
    getDashboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: IDashboardService,  // Usa a interface abstrata como token
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get<IDashboardService>(IDashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard data', async () => {
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

      mockDashboardService.getDashboard.mockResolvedValue(expectedResult);

      const result = await controller.getDashboard(filters);
      expect(result).toEqual(expectedResult);
      expect(mockDashboardService.getDashboard).toHaveBeenCalledWith(filters);
    });
  });
});
