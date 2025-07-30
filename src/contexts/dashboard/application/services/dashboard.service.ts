import { Injectable } from '@nestjs/common';
import { IDashboardService } from '../interfaces/dashboard.service';
import { IDashboardRepository } from '../../infra/interfaces/dashboard.repository';
import { DashboardFilterDto, DashboardResponseDto } from '../../presentation/dtos/get.dto';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(private readonly dashboardRepository: IDashboardRepository) { }

  async getDashboard(filters: DashboardFilterDto): Promise<DashboardResponseDto> {
    return this.dashboardRepository.getDashboardData(filters);
  }
}
