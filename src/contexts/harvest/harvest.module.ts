import { Module } from "@nestjs/common";
import { HarvestService } from "./application/services/harvest.service";
import { IHarvestService } from "./application/interfaces/harvest.service";
import { IHarvestRepository } from "./infra/interfaces/harvest.repository";
import { HarvestRepository } from "./infra/repositories/harvest.repository";
import { DatabasesModule } from "@/resources/database/databases.modules";
import { HarvestController } from "./presentation/controllers/harvest.controller";

@Module({
  imports: [DatabasesModule],
  controllers: [HarvestController],
  providers: [
    {
      provide: IHarvestService,
      useClass: HarvestService,
    },
    {
      provide: IHarvestRepository,
      useClass: HarvestRepository,
    },
  ],
  exports: [IHarvestService, IHarvestRepository],
})
export class HarvestModule { }
