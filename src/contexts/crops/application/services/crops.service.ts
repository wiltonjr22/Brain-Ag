import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCropDto } from '../../presentation/dtos/create.dto';
import { UpdateCropDto } from '../../presentation/dtos/update.dto';
import { CropFilterDto } from '../../presentation/dtos/get.dto';
import { ICropService } from '../interfaces/crops.service';
import { ICropRepository } from '../../infra/interfaces/crops.repository';
import { CropEntity } from '../../commom/entities/crops.entities';

@Injectable()
export class CropService implements ICropService {
  private readonly logger = new Logger(CropService.name);

  constructor(private readonly cropRepository: ICropRepository) { }

  async create(dto: CreateCropDto): Promise<void> {
    this.logger.log('Creating a new crop');
    await this.cropRepository.create(dto);
    this.logger.log('Crop created successfully');
  }

  async findAll(filter: CropFilterDto): Promise<{ data: CropEntity[]; total: number }> {
    this.logger.log('Fetching crops with filters');
    const result = await this.cropRepository.findAll(filter);
    this.logger.log(`${result.total} crop(s) found`);
    return result;
  }

  async findOne(id: string): Promise<CropEntity> {
    this.logger.log(`Fetching crop with ID: ${id}`);
    const crop = await this.cropRepository.findOne(id);
    if (!crop) {
      this.logger.warn(`Crop with ID ${id} not found`);
      throw new NotFoundException('Crop not found');
    }
    this.logger.log('Crop found');
    return crop;
  }

  async update(id: string, dto: UpdateCropDto): Promise<CropEntity> {
    this.logger.log(`Updating crop with ID: ${id}`);
    const updated = await this.cropRepository.update(id, dto);
    this.logger.log('Crop updated successfully');
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing crop with ID: ${id}`);
    await this.cropRepository.remove(id);
    this.logger.log('Crop removed successfully');
  }
}
