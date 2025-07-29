import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IHarvestService } from '../interfaces/harvest.service';
import { IHarvestRepository } from '../../infra/interfaces/harvest.repository';
import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

@Injectable()
export class HarvestService implements IHarvestService {
  private readonly logger = new Logger(HarvestService.name);

  constructor(private readonly harvestRepository: IHarvestRepository) { }

  async create(dto: CreateHarvestDto): Promise<void> {
    this.logger.log('Creating a new harvest');
    await this.harvestRepository.create(dto);
    this.logger.log('Harvest created successfully');
  }

  async findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }> {
    this.logger.log('Fetching harvests with filters');
    const result = await this.harvestRepository.findAll(filter);
    this.logger.log(`${result.total} harvest(s) found`);
    return result;
  }

  async findOne(id: string): Promise<HarvestEntity> {
    this.logger.log(`Fetching harvest with ID: ${id}`);
    const harvest = await this.harvestRepository.findById(id);
    if (!harvest) {
      this.logger.warn(`Harvest with ID ${id} not found`);
      throw new NotFoundException('Harvest not found');
    }
    this.logger.log('Harvest found');
    return harvest;
  }

  async update(id: string, dto: UpdateHarvestDto): Promise<HarvestEntity> {
    this.logger.log(`Updating harvest with ID: ${id}`);
    const updated = await this.harvestRepository.update(id, dto);
    this.logger.log('Harvest updated successfully');
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting harvest with ID: ${id}`);
    await this.harvestRepository.remove(id);
    this.logger.log('Harvest deleted successfully');
  }
}
