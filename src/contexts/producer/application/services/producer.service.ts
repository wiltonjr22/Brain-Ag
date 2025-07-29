import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { IProducerService } from "../interfaces/producer.service";
import { IProducerRepository } from "../../infra/interfaces/producer.repository";
import { CreateProducerDto } from "../../presentation/dtos/create.dto";
import { ProducerEntity } from "../../commom/entities/producer.entities";
import { ProducerFilterDto } from "../../presentation/dtos/get.dto";
import { UpdateProducerDto } from "../../presentation/dtos/update.dto";

@Injectable()
export class ProducerService implements IProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    private readonly producerRepository: IProducerRepository,
  ) { }

  async create(createProducerDto: CreateProducerDto): Promise<void> {
    this.logger.log('Creating a new producer.');
    await this.producerRepository.create(createProducerDto);
    this.logger.log('Producer successfully created.');
  }

  async findAll(filter: ProducerFilterDto): Promise<{ data: ProducerEntity[]; total: number }> {
    this.logger.log('Fetching all producers with filters.');
    const result = await this.producerRepository.findAll(filter);
    this.logger.log(`${result.total} producer(s) found.`);
    return result;
  }

  async findOne(id: string): Promise<ProducerEntity> {
    this.logger.log(`Fetching producer with ID: ${id}`);
    const record = await this.producerRepository.findOne(id);
    if (!record) {
      this.logger.warn(`Producer with ID ${id} not found.`);
      throw new NotFoundException("Producer not found");
    }
    this.logger.log('Producer successfully retrieved.');
    return record;
  }

  async update(id: string, updateDto: UpdateProducerDto): Promise<ProducerEntity> {
    this.logger.log(`Updating producer with ID: ${id}`);
    const updated = await this.producerRepository.update(id, updateDto);
    this.logger.log('Producer successfully updated.');
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting producer with ID: ${id}`);
    await this.producerRepository.remove(id);
    this.logger.log('Producer successfully deleted.');
  }
}
