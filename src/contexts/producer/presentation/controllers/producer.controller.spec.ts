import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { IProducerService } from '../../application/interfaces/producer.service';
import { CreateProducerDto } from '../dtos/create.dto';
import { UpdateProducerDto } from '../dtos/update.dto';
import { ProducerFilterDto } from '../dtos/get.dto';
import { NotFoundException } from '@nestjs/common';
import { DocType } from '../../commom/entities/producer.entities';

const mockProducer = {
  id: '15ff1a4b-a17f-4bec-865b-c585c2d732b9',
  name: 'João da Silva',
  docType: 'CPF',
  document: '12345678909',
  active: true,
};

const mockProducerService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: IProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: IProducerService,
          useValue: mockProducerService,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<IProducerService>(IProducerService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a producer with valid CPF', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor CPF Válido',
        docType: DocType.CPF,
        document: '12345678909',
      };

      mockProducerService.create.mockResolvedValue(mockProducer);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProducer);
    });

    it('should create a producer with valid CNPJ', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor CNPJ Válido',
        docType: DocType.CNPJ,
        document: '19100000000100',
      };

      const mockCnpjResponse = {
        ...mockProducer,
        name: dto.name,
        docType: dto.docType,
        document: dto.document,
      };

      mockProducerService.create.mockResolvedValue(mockCnpjResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCnpjResponse);
    });

    it('should throw error if CPF invalid', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor CPF Inválido',
        docType: DocType.CPF,
        document: '12345678900', 
      };

      mockProducerService.create.mockImplementation(() => {
        throw new Error('Documento inválido para o tipo informado');
      });

      await expect(controller.create(dto)).rejects.toThrow('Documento inválido para o tipo informado');
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error if CNPJ invalid', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor CNPJ Inválido',
        docType: DocType.CNPJ,
        document: '00000000000000', 
      };

      mockProducerService.create.mockImplementation(() => {
        throw new Error('Documento inválido para o tipo informado');
      });

      await expect(controller.create(dto)).rejects.toThrow('Documento inválido para o tipo informado');
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error if docType is CPF but document is CNPJ format', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor DocType CPF com documento CNPJ',
        docType: DocType.CPF,
        document: '19100000000100', 
      };

      mockProducerService.create.mockImplementation(() => {
        throw new Error('Documento inválido para o tipo informado');
      });

      await expect(controller.create(dto)).rejects.toThrow('Documento inválido para o tipo informado');
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error if docType is CNPJ but document is CPF format', async () => {
      const dto: CreateProducerDto = {
        name: 'Produtor DocType CNPJ com documento CPF',
        docType: DocType.CNPJ,
        document: '12345678909',
      };

      mockProducerService.create.mockImplementation(() => {
        throw new Error('Documento inválido para o tipo informado');
      });

      await expect(controller.create(dto)).rejects.toThrow('Documento inválido para o tipo informado');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });


  describe('findAll', () => {
    it('should return a list of producers', async () => {
      const filter: ProducerFilterDto = { name: 'João' };
      const returnData = { data: [mockProducer], total: 1 };

      mockProducerService.findAll.mockResolvedValue(returnData);

      const result = await controller.findAll(filter);

      expect(service.findAll).toHaveBeenCalledWith(filter);
      expect(result).toEqual(returnData);
    });
  });

  describe('findOne', () => {
    it('should return a producer if found', async () => {
      mockProducerService.findOne.mockResolvedValue(mockProducer);

      const result = await controller.findOne('uuid-produtor');

      expect(service.findOne).toHaveBeenCalledWith('uuid-produtor');
      expect(result).toEqual(mockProducer);
    });

    it('should throw NotFoundException if not found', async () => {
      mockProducerService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('update', () => {
    it('should update and return the updated producer', async () => {
      const dto: UpdateProducerDto = { name: 'João Atualizado' };
      mockProducerService.update.mockResolvedValue({ ...mockProducer, ...dto });

      const result = await controller.update('uuid-produtor', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-produtor', dto);
      expect(result.name).toBe(dto.name);
    });
  });

  describe('remove', () => {
    it('should call remove method of service', async () => {
      mockProducerService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('uuid-produtor');

      expect(service.remove).toHaveBeenCalledWith('uuid-produtor');
      expect(result).toBeUndefined();
    });
  });
});
