import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateFarmDto } from '@/contexts/farm/presentation/dtos/create.dto';

describe('FarmController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;
  let createdFarmId: string;
  let farmIdToDelete: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);

    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });
    producerId = producer.id;

    const farmWithDependencies = await prisma.farm.create({
      data: {
        name: 'Fazenda Com Dependencias',
        city: 'Cidade X',
        state: 'SP',
        totalArea: 150,
        arableArea: 100,
        vegetationArea: 50,
        producerId: producerId,
      },
    });
    createdFarmId = farmWithDependencies.id;

    await prisma.crop.create({
      data: {
        name: 'Soja',
        farmId: createdFarmId,
        harvestId: (await prisma.harvest.create({ data: { year: 2025 } })).id,
      },
    });

    const farmToDelete = await prisma.farm.create({
      data: {
        name: 'Fazenda Para Deletar',
        city: 'Cidade Y',
        state: 'MG',
        totalArea: 80,
        arableArea: 60,
        vegetationArea: 20,
        producerId: producerId,
      },
    });
    farmIdToDelete = farmToDelete.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST fazendas', async () => {
    const dto: CreateFarmDto = {
      name: 'Fazenda E2E Nova',
      city: 'Campo Novo',
      state: 'SP',
      totalArea: 100,
      arableArea: 70,
      vegetationArea: 30,
      producerId,
    };

    const res = await request(app.getHttpServer())
      .post('/fazendas')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/GET fazendas should return a list of farms', async () => {
    const res = await request(app.getHttpServer())
      .get('/fazendas')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET fazendas/:id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/fazendas/${createdFarmId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdFarmId);
  });

  it('/PATCH fazendas/:id', async () => {
    const updatedName = 'Fazenda Atualizada';
    const res = await request(app.getHttpServer())
      .patch(`/fazendas/${createdFarmId}`)
      .send({ name: updatedName })
      .expect(200);

    expect(res.body.name).toBe(updatedName);
  });

  it('/DELETE fazendas/:id should delete a farm', async () => {
    await request(app.getHttpServer())
      .delete(`/fazendas/${farmIdToDelete}`)
      .expect(204);
  });

  it('/DELETE fazendas/:id should fail to delete a farm with crops', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/fazendas/${createdFarmId}`)
      .expect(500);

    expect(res.body).toHaveProperty('message');
  });
});
