import { Test, TestingModule } from '@nestjs/testing';
import { ProducerRepository } from './producer.repository';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateProducerDto } from '../../presentation/dtos/create.dto';
import { UpdateProducerDto } from '../../presentation/dtos/update.dto';
import { ProducerFilterDto } from '../../presentation/dtos/get.dto';
import { ProducerEntity, DocType } from '../../commom/entities/producer.entities';

describe('ProducerRepository', () => {
  let repository: ProducerRepository;
  let prisma: {
    producer: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      producer: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = module.get<ProducerRepository>(ProducerRepository);
  });

  describe('create', () => {
    it('should call prisma.create with correct data', async () => {
      const dto: CreateProducerDto = {
        name: 'Test Producer',
        docType: DocType.CPF,
        document: '12345678909',
      };

      prisma.producer.create.mockResolvedValue({ ...dto, id: 'uuid', created_at: new Date(), updated_at: new Date() });

      await repository.create(dto);

      expect(prisma.producer.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return producers list with total', async () => {
      const filter: ProducerFilterDto = { name: 'Test' };

      const dbResponse = [
        {
          id: 'uuid1',
          name: 'Test Producer 1',
          document: '12345678909',
          doc_type: DocType.CPF,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      prisma.producer.findMany.mockResolvedValue(dbResponse);
      prisma.producer.count.mockResolvedValue(dbResponse.length);

      const result = await repository.findAll(filter);

      expect(prisma.producer.findMany).toHaveBeenCalled();
      expect(prisma.producer.count).toHaveBeenCalled();
      expect(result.data[0].name).toBe('Test Producer 1');
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return producer entity if found', async () => {
      const dbProducer = {
        id: 'uuid1',
        name: 'Test Producer',
        document: '12345678909',
        doc_type: DocType.CPF,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.producer.findUnique.mockResolvedValue(dbProducer);

      const result = await repository.findOne('uuid1');

      expect(prisma.producer.findUnique).toHaveBeenCalledWith({ where: { id: 'uuid1' } });
      expect(result.id).toBe('uuid1');
      expect(result.name).toBe('Test Producer');
    });

    it('should return null if producer not found', async () => {
      prisma.producer.findUnique.mockResolvedValue(null);

      const result = await repository.findOne('non-existing-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update producer and return entity', async () => {
      const updateDto: UpdateProducerDto = { name: 'Updated Producer' };

      const dbUpdated = {
        id: 'uuid1',
        name: 'Updated Producer',
        document: '12345678909',
        doc_type: DocType.CPF,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prisma.producer.update.mockResolvedValue(dbUpdated);

      const result = await repository.update('uuid1', updateDto);

      expect(prisma.producer.update).toHaveBeenCalledWith({
        where: { id: 'uuid1' },
        data: {
          name: updateDto.name,
          document: undefined,
          docType: undefined,
        },
      });

      expect(result.name).toBe('Updated Producer');
    });
  });

});
