import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IDashboardService } from '../../application/interfaces/dashboard.service';
import { DashboardFilterDto, DashboardResponseDto } from '../dtos/get.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: IDashboardService) { }

  @Get()
  async getDashboard(
    @Query() filters: DashboardFilterDto,
  ): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboard(filters);
  }
}
