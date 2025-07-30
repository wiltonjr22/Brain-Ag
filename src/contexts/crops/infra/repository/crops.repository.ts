import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateCropDto } from '../../presentation/dtos/create.dto';
import { UpdateCropDto } from '../../presentation/dtos/update.dto';
import { CropFilterDto } from '../../presentation/dtos/get.dto';
import { ICropRepository } from '../interfaces/crops.repository';
import { CropEntity } from '../../commom/entities/crops.entities';

@Injectable()
export class CropRepository implements ICropRepository {
  private readonly logger = new Logger(CropRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateCropDto): Promise<void> {
    this.logger.log(`Creating crop: ${dto.name}`);
    await this.prisma.crop.create({
      data: {
        name: dto.name,
        farmId: dto.farmId,
        harvestId: dto.harvestId,
      },
    });
    this.logger.log('Crop created successfully in database');
  }

  async findAll(filter: CropFilterDto): Promise<{ data: CropEntity[]; total: number }> {
    this.logger.log('Fetching crops with filters');

    const { name, farmId, harvestId, limit = 10, offset = 0 } = filter;
    const where: any = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (farmId) where.farmId = farmId;
    if (harvestId) where.harvestId = harvestId;

    const [dataRaw, total] = await Promise.all([
      this.prisma.crop.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.crop.count({ where }),
    ]);

    this.logger.log(`${total} crop(s) found`);

    const data = dataRaw.map(this.toEntity);
    return { data, total };
  }

  async findOne(id: string): Promise<CropEntity | null> {
    this.logger.log(`Fetching crop with ID: ${id}`);
    const crop = await this.prisma.crop.findUnique({ where: { id } });
    if (!crop) {
      this.logger.warn(`Crop with ID ${id} not found`);
      return null;
    }
    return this.toEntity(crop);
  }

  async update(id: string, dto: UpdateCropDto): Promise<CropEntity> {
    this.logger.log(`Updating crop with ID: ${id}`);
    const updated = await this.prisma.crop.update({
      where: { id },
      data: {
        name: dto.name,
        farmId: dto.farmId,
        harvestId: dto.harvestId,
      },
    });
    this.logger.log('Crop updated successfully');
    return this.toEntity(updated);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing crop with ID: ${id}`);
    await this.prisma.crop.delete({ where: { id } });
    this.logger.log('Crop removed successfully');
  }

  private toEntity(data: any): CropEntity {
    return {
      id: data.id,
      name: data.name,
      farmId: data.farmId,
      harvestId: data.harvestId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
