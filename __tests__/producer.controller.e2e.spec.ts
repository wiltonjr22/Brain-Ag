import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateProducerDto } from '../src/contexts/producer/presentation/dtos/create.dto';
import { DocType } from '../src/contexts/producer/commom/entities/producer.entities';
import { UpdateProducerDto } from '../src/contexts/producer/presentation/dtos/update.dto';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockCreateDto: CreateProducerDto;
  let updateDto: UpdateProducerDto;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = moduleRef.get(PrismaService);

    mockCreateDto = {
      docType: DocType.CPF,
      document: '11144477735',
      name: 'João da Silva',
    };

    updateDto = {
      name: 'João Atualizado',
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST produtores', async () => {
    const response = await request(app.getHttpServer())
      .post('/produtores')
      .send(mockCreateDto)
      .expect(201);


    expect(response.body).toEqual({});
  });

  it('/GET produtores should return a list of producers', async () => {
    const res = await request(app.getHttpServer())
      .get('/produtores')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/GET produtores/:id', async () => {

    const producer = await prisma.producer.findFirst({
      where: {
        document: mockCreateDto.document,
        docType: mockCreateDto.docType,
      },
    });
    const response = await request(app.getHttpServer())
      .get(`/produtores/${producer.id}`)
      .expect(200);

    expect(response.body.id).toBe(producer.id);
  });

  it('/PATCH produtores/:id', async () => {
    const producer = await prisma.producer.findFirst({
      where: {
        document: mockCreateDto.document,
        docType: mockCreateDto.docType,
      },
    });
    const response = await request(app.getHttpServer())
      .patch(`/produtores/${producer.id}`)
      .send(updateDto)
      .expect(200);

    expect(response.body.name).toBe(updateDto.name);
  });

  it('/DELETE produtores/:id', async () => {
    const producer = await prisma.producer.findFirst({
      where: {
        document: mockCreateDto.document,
        docType: mockCreateDto.docType,
      },
    });
    await request(app.getHttpServer())
      .delete(`/produtores/${producer.id}`)
      .expect(204);
  });
});
