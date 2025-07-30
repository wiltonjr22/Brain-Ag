import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { ProducerModule } from "./producer/producer.module";
import { FarmModule } from "./farm/farm.module";
import { HarvestModule } from "./harvest/harvest.module";
import { CropModule } from "./crops/crops.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    HealthModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
    CropModule,
    DashboardModule
  ],
})
export class ContextsModule { }