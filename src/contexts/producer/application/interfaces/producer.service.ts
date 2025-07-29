import { ProducerEntity } from "../../commom/entities/producer.entities";
import { CreateProducerDto } from "../../presentation/dtos/create.dto";
import { UpdateProducerDto } from "../../presentation/dtos/update.dto";

export abstract class IProducerService {
  abstract create(createCommunicationDto: CreateProducerDto): Promise<void>;
  abstract findAll(): Promise<ProducerEntity[]>
  abstract findOne(id: string): Promise<ProducerEntity>;
  abstract update(id: string, updateDto: UpdateProducerDto): Promise<ProducerEntity>;
  abstract remove(id: string): Promise<void>;
}