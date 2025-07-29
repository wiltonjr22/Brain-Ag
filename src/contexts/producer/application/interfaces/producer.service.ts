import { ProducerEntity } from "../../commom/entities/producer.entities";
import { CreateProducerDto } from "../../presentation/dtos/create.dto";
import { ProducerFilterDto } from "../../presentation/dtos/get.dto";
import { UpdateProducerDto } from "../../presentation/dtos/update.dto";

export abstract class IProducerService {
  abstract create(createProducerDto: CreateProducerDto): Promise<void>;
  abstract findAll(filter: ProducerFilterDto): Promise<{ data: ProducerEntity[]; total: number }>;
  abstract findOne(id: string): Promise<ProducerEntity>;
  abstract update(id: string, updateDto: UpdateProducerDto): Promise<ProducerEntity>;
  abstract remove(id: string): Promise<void>;
}