import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IFarmService } from '../interfaces/farm.service';
import { IFarmRepository } from '../../infra/interfaces/farm.repository';
import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { FarmFilterDto } from '../../presentation/dtos/get.dto';
import { FarmEntity } from '../../commom/entities/communication.entities';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';

@Injectable()
export class FarmService implements IFarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(private readonly farmRepository: IFarmRepository) { }

  async create(dto: CreateFarmDto): Promise<void> {
    this.logger.log(`Creating farm: ${dto.name}`);
    await this.farmRepository.create(dto);
    this.logger.log('Farm created successfully.');
  }

  async findAll(filter: FarmFilterDto): Promise<{ data: FarmEntity[]; total: number }> {
    this.logger.log('Fetching farms with filters...');
    const result = await this.farmRepository.findAll(filter);
    this.logger.log(`${result.total} farm(s) found.`);
    return result;
  }

  async findOne(id: string): Promise<FarmEntity> {
    this.logger.log(`Fetching farm by ID: ${id}`);
    const farm = await this.farmRepository.findOne(id);
    if (!farm) {
      this.logger.warn(`Farm with ID ${id} not found.`);
      throw new NotFoundException('Farm not found');
    }
    return farm;
  }

  async update(id: string, dto: UpdateFarmDto): Promise<FarmEntity> {
    this.logger.log(`Updating farm with ID: ${id}`);
    return this.farmRepository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing farm with ID: ${id}`);
    await this.farmRepository.remove(id);
    this.logger.log('Farm removed successfully.');
  }
}
