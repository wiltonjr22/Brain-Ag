import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { ProducerModule } from "./producer/producer.module";

@Module({
  imports: [
    HealthModule,
    ProducerModule,
  ],
})
export class ContextsModule { }