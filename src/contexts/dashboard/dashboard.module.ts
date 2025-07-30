import { Module } from "@nestjs/common";
import { DatabasesModule } from "@/resources/database/databases.modules";
import { DashboardController } from "./presentation/controllers/dashboard.controller";
import { IDashboardService } from "./application/interfaces/dashboard.service";
import { DashboardService } from "./application/services/dashboard.service";
import { IDashboardRepository } from "./infra/interfaces/dashboard.repository";
import { DashboardRepository } from "./infra/repositories/communication.repository";

@Module({
  imports: [DatabasesModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: IDashboardService,
      useClass: DashboardService,
    },
    {
      provide: IDashboardRepository,
      useClass: DashboardRepository,
    },
  ],
  exports: [IDashboardService, IDashboardRepository],
})
export class DashboardModule { }
