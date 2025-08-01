import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('HarvestController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;
  let createdHarvestId: string;
  let harvestToDeleteId: string;
  let harvestWithCropsId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await prisma.crop.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();

    const uniqueDocument = `1234567890${Date.now()}`;
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor Teste',
        document: uniqueDocument,
        docType: 'CPF',
      },
    });
    producerId = producer.id;
    const harvestToDelete = await prisma.harvest.create({
      data: {
        year: 2024,
      },
    });
    harvestToDeleteId = harvestToDelete.id;

    const harvestWithCrops = await prisma.harvest.create({
      data: {
        year: 2025,
      },
    });
    harvestWithCropsId = harvestWithCrops.id;

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Teste',
        city: 'Cidade Teste',
        state: 'Estado Teste',
        totalArea: 100,
        arableArea: 80,
        vegetationArea: 20,
        producer: { connect: { id: producerId } },
      },
    });

    await prisma.crop.create({
      data: {
        name: 'Milho',
        farmId: farm.id,
        harvestId: harvestWithCropsId,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST safras', async () => {
    const dto = { year: 2026 };

    const res = await request(app.getHttpServer())
      .post('/safras')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/GET safras should return a list of harvests', async () => {
    const res = await request(app.getHttpServer())
      .get('/safras')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET safras/:id', async () => {
    const harvest = await prisma.harvest.findFirst({
      where: {
        year: 2025,

      },
    });
    const res = await request(app.getHttpServer())
      .get(`/safras/${harvest.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', harvest.id);
  });

  it('/PATCH safras/:id', async () => {
    const harvest = await prisma.harvest.findFirst({
      where: {
        year: 2025,

      },
    });
    const updatedYear = 2027;
    const res = await request(app.getHttpServer())
      .patch(`/safras/${harvest.id}`)
      .send({ year: updatedYear })
      .expect(200);

    expect(res.body.year).toBe(updatedYear);
  });

  it('/harvests/:id (DELETE) should delete a harvest with no crops', async () => {
    await request(app.getHttpServer())
      .delete(`/safras/${harvestToDeleteId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/harvests/${harvestToDeleteId}`)
      .expect(404);
  });

  it('/harvests/:id (DELETE) should fail to delete a harvest with crops', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/safras/${harvestWithCropsId}`)
      .expect(500);

    expect(res.body).toHaveProperty('message');
  });
});
