import { DashboardFilterDto, DashboardResponseDto } from "../../presentation/dtos/get.dto";

export abstract class IDashboardRepository {
  abstract getDashboardData(filters: DashboardFilterDto): Promise<DashboardResponseDto>
}