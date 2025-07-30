import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { IHarvestRepository } from '../interfaces/harvest.repository';
import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

@Injectable()
export class HarvestRepository implements IHarvestRepository {
  private readonly logger = new Logger(HarvestRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateHarvestDto): Promise<void> {
    this.logger.log(`Creating harvest for year: ${data.year}`);
    await this.prisma.harvest.create({
      data: {
        year: data.year,
      },
    });
    this.logger.log('Harvest created in database');
  }

  async findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }> {
    this.logger.log('Finding harvests with filters...');

    const { year, limit = 10, offset = 0 } = filter;
    const where: any = {};

    if (year) where.year = year;

    const [dataRaw, total] = await Promise.all([
      this.prisma.harvest.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      this.prisma.harvest.count({ where }),
    ]);

    this.logger.log(`${total} harvest(s) found`);

    const data = dataRaw.map(this.toEntity);
    return { data, total };
  }

  async findOne(id: string): Promise<HarvestEntity | null> {
    this.logger.log(`Finding harvest by ID: ${id}`);
    const harvest = await this.prisma.harvest.findUnique({ where: { id } });
    if (!harvest) {
      this.logger.warn(`Harvest with ID ${id} not found`);
      return null;
    }
    this.logger.log('Harvest found');
    return this.toEntity(harvest);
  }

  async update(id: string, data: UpdateHarvestDto): Promise<HarvestEntity> {
    this.logger.log(`Updating harvest with ID: ${id}`);
    const updated = await this.prisma.harvest.update({
      where: { id },
      data,
    });
    this.logger.log('Harvest updated successfully');
    return this.toEntity(updated);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting harvest with ID: ${id}`);
    await this.prisma.harvest.delete({ where: { id } });
    this.logger.log('Harvest deleted successfully');
  }

  private toEntity(data: any): HarvestEntity {
    return {
      id: data.id,
      year: data.year,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
