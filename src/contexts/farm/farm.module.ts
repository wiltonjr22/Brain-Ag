import { Module } from "@nestjs/common";
import { DatabasesModule } from "@/resources/database/databases.modules";
import { IFarmService } from "./application/interfaces/farm.service";
import { FarmController } from "./presentation/controllers/farm.controller";
import { FarmService } from "./application/services/farm.service";
import { FarmRepository } from "./infra/repositories/farm.repository";
import { IFarmRepository } from "./infra/interfaces/farm.repository";

@Module({
  imports: [DatabasesModule],
  controllers: [FarmController],
  providers: [
    {
      provide: IFarmService,
      useClass: FarmService,
    },
    {
      provide: IFarmRepository,
      useClass: FarmRepository,
    },
  ],
  exports: [IFarmService, IFarmRepository],
})
export class FarmModule { }
