import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateFarmDto } from '@/contexts/farm/presentation/dtos/create.dto';

describe('FarmController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();
    await prisma.harvest.deleteMany();
  });

  it('/POST fazendas', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E POST',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    const dto: CreateFarmDto = {
      name: 'Fazenda E2E Nova',
      city: 'Campo Novo',
      state: 'SP',
      totalArea: 100,
      arableArea: 70,
      vegetationArea: 30,
      producerId: producer.id,
    };

    const res = await request(app.getHttpServer())
      .post('/fazendas')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/GET fazendas should return a list of farms', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E GET LIST',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    await prisma.farm.create({
      data: {
        name: 'Fazenda Teste GET LIST',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 50,
        arableArea: 30,
        vegetationArea: 20,
        producerId: producer.id,
      },
    });

    const res = await request(app.getHttpServer())
      .get('/fazendas')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET fazendas/:id', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E GET ID',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Teste GET ID',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 60,
        arableArea: 40,
        vegetationArea: 20,
        producerId: producer.id,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/fazendas/${farm.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', farm.id);
  });

  it('/PATCH fazendas/:id', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E PATCH',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Teste PATCH',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 70,
        arableArea: 50,
        vegetationArea: 20,
        producerId: producer.id,
      },
    });

    const updatedName = 'Fazenda Atualizada PATCH';

    const res = await request(app.getHttpServer())
      .patch(`/fazendas/${farm.id}`)
      .send({ name: updatedName })
      .expect(200);

    expect(res.body.name).toBe(updatedName);
  });

  it('/DELETE fazendas/:id should delete a farm', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E DELETE',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Teste DELETE',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 80,
        arableArea: 60,
        vegetationArea: 20,
        producerId: producer.id,
      },
    });

    await request(app.getHttpServer())
      .delete(`/fazendas/${farm.id}`)
      .expect(204);
  });

  it('/DELETE fazendas/:id should fail to delete a farm with crops', async () => {
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E DELETE FAIL',
        document: `1234567890${Date.now()}`,
        docType: 'CPF',
      },
    });

    const harvest = await prisma.harvest.create({ data: { year: 2025 } });

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Com Dependencias DELETE FAIL',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 90,
        arableArea: 70,
        vegetationArea: 20,
        producerId: producer.id,
      },
    });

    await prisma.crop.create({
      data: {
        name: 'Soja DELETE FAIL',
        farmId: farm.id,
        harvestId: harvest.id,
      },
    });

    const res = await request(app.getHttpServer())
      .delete(`/fazendas/${farm.id}`)
      .expect(500);

    expect(res.body).toHaveProperty('message');
  });
});
