import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { ProducerModule } from "./producer/producer.module";
import { FarmModule } from "./farm/farm.module";
import { HarvestModule } from "./harvest/harvest.module";

@Module({
  imports: [
    HealthModule,
    ProducerModule,
    FarmModule,
    HarvestModule,
  ],
})
export class ContextsModule { }