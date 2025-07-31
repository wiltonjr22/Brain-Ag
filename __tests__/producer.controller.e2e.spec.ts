import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { CreateProducerDto } from '../src/contexts/producer/presentation/dtos/create.dto';
import { DocType } from '../src/contexts/producer/commom/entities/producer.entities';
import { UpdateProducerDto } from '../src/contexts/producer/presentation/dtos/update.dto';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  const mockCreateDto: CreateProducerDto = {
    docType: DocType.CPF,
    document: '11144477735',
    name: 'João da Silva',
  };

  const updateDto: UpdateProducerDto = {
    name: 'João Atualizado',
    validateDocumentUpdate: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
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


  it('/GET produtores/:id', async () => {
    if (!createdId) return;

    const response = await request(app.getHttpServer())
      .get(`/produtores/${createdId}`)
      .expect(200);

    console.log('GET /produtores/:id response:', response.body);
    expect(response.body.id).toBe(createdId);
  });

  it('/PATCh produtores/:id', async () => {
    if (!createdId) return;

    const response = await request(app.getHttpServer())
      .patch(`/produtores/${createdId}`)
      .send(updateDto)
      .expect(200);

    console.log('PATCH /produtores/:id response:', response.body);
    expect(response.body.name).toBe(updateDto.name);
  });

  it('/DELETE produtores/:id', async () => {
    if (!createdId) return;

    await request(app.getHttpServer())
      .delete(`/produtores/${createdId}`)
      .expect(200);
  });
});