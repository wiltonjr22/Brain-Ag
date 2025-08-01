import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('DashboardController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;
  let state: string;
  let cropName: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();
    await prisma.harvest.deleteMany();

    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor Dashboard',
        document: '18590260011',
        docType: 'CPF',
      },
    });
    producerId = producer.id;

    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda Dashboard',
        city: 'Cidade Dash',
        state: 'SP',
        totalArea: 150,
        arableArea: 100,
        vegetationArea: 50,
        producerId,
      },
    });
    state = farm.state;

    const harvest = await prisma.harvest.create({
      data: {
        year: new Date().getFullYear(),
      },
    });

    const crop = await prisma.crop.create({
      data: {
        name: 'Milho Dashboard',
        farmId: farm.id,
        harvestId: harvest.id,
      },
    });
    cropName = crop.name;
  });

  afterEach(async () => {
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.producer.deleteMany();
    await prisma.harvest.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/dashboard (GET) - without filters', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard')
      .expect(200);

    expect(res.body).toHaveProperty('totalFarms');
    expect(res.body).toHaveProperty('totalHectares');
    expect(res.body).toHaveProperty('farmsByState');
    expect(res.body).toHaveProperty('cropsDistribution');
    expect(res.body).toHaveProperty('landUseDistribution');
  });

  it('/dashboard (GET) - with filters', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard')
      .query({
        producerId,
        state,
        cropName,
      })
      .expect(200);

    expect(res.body).toHaveProperty('totalFarms');
    expect(res.body.farmsByState.some((f: any) => f.state === state)).toBe(true);
    expect(res.body.cropsDistribution.some((c: any) => c.name === cropName)).toBe(true);
  });
});
