import { Module } from "@nestjs/common";
import { ProducerController } from "./presentation/controllers/producer.controller";
import { DatabasesModule } from "@/resources/database/databases.modules";
import { IProducerService } from "./application/interfaces/producer.service";
import { ProducerService } from "./application/services/producer.service";
import { IProducerRepository } from "./infra/interfaces/producer.repository";
import { ProducerRepository } from "./infra/repository/producer.repository";

@Module({
  imports: [DatabasesModule],
  controllers: [ProducerController],
  providers: [
    {
      provide: IProducerService,
      useClass: ProducerService,
    },
    {
      provide: IProducerRepository,
      useClass: ProducerRepository,
    },
  ],
  exports: [IProducerService, IProducerRepository],
})
export class ProducerModule { }
