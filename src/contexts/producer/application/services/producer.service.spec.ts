import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { IProducerRepository } from '../../infra/interfaces/producer.repository';
import { CreateProducerDto } from '../../presentation/dtos/create.dto';
import { UpdateProducerDto } from '../../presentation/dtos/update.dto';
import { ProducerFilterDto } from '../../presentation/dtos/get.dto';
import { ProducerEntity, DocType } from '../../commom/entities/producer.entities';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: jest.Mocked<IProducerRepository>;

  const mockProducer: ProducerEntity = {
    id: 'id-123',
    name: 'João da Silva',
    docType: DocType.CPF,
    document: '12345678909',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const repositoryMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: IProducerRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get(IProducerRepository) as jest.Mocked<IProducerRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call repository.create with dto', async () => {
      const dto: CreateProducerDto = {
        name: 'João da Silva',
        docType: DocType.CPF,
        document: '12345678909',
      };

      repository.create.mockResolvedValue(undefined);

      await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return producers list and total', async () => {
      const filter: ProducerFilterDto = { name: 'João' };
      const mockResult = { data: [mockProducer], total: 1 };

      repository.findAll.mockResolvedValue(mockResult);

      const result = await service.findAll(filter);

      expect(repository.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a producer if found', async () => {
      repository.findOne.mockResolvedValue(mockProducer);

      const result = await service.findOne('id-123');

      expect(repository.findOne).toHaveBeenCalledWith('id-123');
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if producer not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id-404')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith('id-404');
    });
  });

  describe('update', () => {
    it('should update and return updated producer', async () => {
      const dto: UpdateProducerDto = { name: 'João Atualizado' };

      const updatedProducer = { ...mockProducer, ...dto };

      repository.update.mockResolvedValue(updatedProducer);

      const result = await service.update('id-123', dto);

      expect(repository.update).toHaveBeenCalledWith('id-123', dto);
      expect(result).toEqual(updatedProducer);
    });
  });

  describe('remove', () => {
    it('should call repository.remove', async () => {
      repository.remove.mockResolvedValue(undefined);

      await service.remove('id-123');

      expect(repository.remove).toHaveBeenCalledWith('id-123');
    });
  });
});
