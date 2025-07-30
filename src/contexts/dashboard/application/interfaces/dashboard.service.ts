import { DashboardFilterDto, DashboardResponseDto } from "../../presentation/dtos/get.dto";

export abstract class IDashboardService {
  abstract getDashboard(filters: DashboardFilterDto): Promise<DashboardResponseDto>
}