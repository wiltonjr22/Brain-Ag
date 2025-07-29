import { Module } from "@nestjs/common";
import { CropController } from "./presentation/controllers/crop.controller";
import { CropService } from "./application/services/crops.service";
import { ICropService } from "./application/interfaces/crops.service";
import { ICropRepository } from "./infra/interfaces/crops.repository";
import { CropRepository } from "./infra/repositories/crops.repository";
import { DatabasesModule } from "@/resources/database/databases.modules";

@Module({
  imports: [DatabasesModule],
  controllers: [CropController],
  providers: [
    {
      provide: ICropService,
      useClass: CropService,
    },
    {
      provide: ICropRepository,
      useClass: CropRepository,
    },
  ],
  exports: [ICropService, ICropRepository],
})
export class CropModule { }
