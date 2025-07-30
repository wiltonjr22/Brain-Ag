import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { IProducerRepository } from '../interfaces/producer.repository';
import { ProducerEntity } from '../../commom/entities/producer.entities';
import { UpdateProducerDto } from '../../presentation/dtos/update.dto';
import { CreateProducerDto } from '../../presentation/dtos/create.dto';
import { ProducerFilterDto } from '../../presentation/dtos/get.dto';

@Injectable()
export class ProducerRepository implements IProducerRepository {
  private readonly logger = new Logger(ProducerRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateProducerDto): Promise<void> {
    this.logger.log(`Creating producer: ${data.name}`);
    await this.prisma.producer.create({
      data: data,
    });
    this.logger.log('Producer successfully created in the database.');
  }

  async findAll(filter: ProducerFilterDto): Promise<{ data: ProducerEntity[]; total: number }> {
    this.logger.log('Fetching producers with filters...');

    const {
      name,
      document,
      docType,
      createdAtStart,
      createdAtEnd,
      limit = 10,
      offset = 0,
    } = filter;

    const where: any = {};

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (document) where.document = { contains: document };
    if (docType) where.doc_type = docType;

    if (createdAtStart || createdAtEnd) {
      where.created_at = {};
      if (createdAtStart) where.created_at.gte = new Date(createdAtStart);
      if (createdAtEnd) where.created_at.lte = new Date(createdAtEnd);
    }

    const [dataRaw, total] = await Promise.all([
      this.prisma.producer.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.producer.count({ where }),
    ]);

    this.logger.log(`${total} producer(s) found.`);

    const data = dataRaw.map(this.toEntity);
    return { data, total };
  }

  async findOne(id: string): Promise<ProducerEntity | null> {
    this.logger.log(`Fetching producer by ID: ${id}`);
    const producer = await this.prisma.producer.findUnique({ where: { id } });

    if (!producer) {
      this.logger.warn(`Producer with ID ${id} not found.`);
      return null;
    }

    this.logger.log(`Producer found: ${producer.name}`);
    return this.toEntity(producer);
  }

  async update(id: string, data: UpdateProducerDto): Promise<ProducerEntity> {
    this.logger.log(`Updating producer with ID: ${id}`);
    const updated = await this.prisma.producer.update({
      where: { id },
      data: {
        name: data.name,
        document: data.document,
        docType: data.docType,
      },
    });
    this.logger.log(`Producer with ID ${id} successfully updated.`);
    return this.toEntity(updated);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting producer with ID: ${id}`);
    await this.prisma.producer.delete({ where: { id } });
    this.logger.log(`Producer with ID ${id} successfully updated.`);
    return;
  }

  private toEntity(data: any): ProducerEntity {
    return {
      id: data.id,
      name: data.name,
      document: data.document,
      docType: data.doc_type,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
