import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { IFarmRepository } from '../interfaces/farm.repository';
import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { FarmFilterDto } from '../../presentation/dtos/get.dto';
import { FarmEntity } from '../../commom/entities/communication.entities';

@Injectable()
export class FarmRepository implements IFarmRepository {
  private readonly logger = new Logger(FarmRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateFarmDto): Promise<void> {
    this.logger.log(`Creating farm: ${data.name}`);
    await this.prisma.farm.create({ data });
    this.logger.log('Farm created successfully.');
  }

  async findAll(filter: FarmFilterDto): Promise<{ data: FarmEntity[]; total: number }> {
    this.logger.log('Retrieving farms with filters...');
    const { limit = 10, offset = 0, producerId, city, state } = filter;

    const where: any = {};
    if (filter.producerId) where.producerId = producerId;
    if (filter.city) where.city = city;
    if (filter.state) where.state = state;

    const [farms, total] = await Promise.all([
      this.prisma.farm.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.farm.count({ where }),
    ]);

    const data = farms.map(this.toEntity);
    this.logger.log(`${total} farm(s) found.`);
    return { data, total };
  }

  async findOne(id: string): Promise<FarmEntity | null> {
    this.logger.log(`Fetching farm by ID: ${id}`);
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) {
      this.logger.warn(`Farm with ID ${id} not found.`);
      return null;
    }
    return this.toEntity(farm);
  }

  async update(id: string, data: UpdateFarmDto): Promise<FarmEntity> {
    this.logger.log(`Updating farm with ID: ${id}`);
    const updated = await this.prisma.farm.update({ where: { id }, data });
    return this.toEntity(updated);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Attempting to delete farm with ID: ${id}`);

    const crops = await this.prisma.crop.findMany({ where: { farmId: id } });
    if (crops.length > 0) {
      throw new Error(`Cannot delete farm with ID ${id} because it has associated crops`);
    }

    await this.prisma.farm.delete({ where: { id } });

    this.logger.log(`Farm with ID ${id} removed successfully`);
  }


  private toEntity(data: any): FarmEntity {
    return {
      id: data.id,
      name: data.name,
      city: data.city,
      state: data.state,
      totalArea: data.totalArea,
      arableArea: data.arableArea,
      vegetationArea: data.vegetationArea,
      producerId: data.producerId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
