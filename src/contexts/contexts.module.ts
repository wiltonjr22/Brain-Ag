import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { ProducerModule } from "./producer/producer.module";
import { FarmModule } from "./farm/farm.module";

@Module({
  imports: [
    HealthModule,
    ProducerModule,
    FarmModule,
  ],
})
export class ContextsModule { }