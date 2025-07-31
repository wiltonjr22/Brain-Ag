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

    const crop = await prisma.crop.findFirst({
      include: {
        farm: { include: { producer: true } },
      },
    });

    if (!crop) {
      throw new Error('Seed data missing: expected at least one crop.');
    }

    cropName = crop.name;
    state = crop.farm.state;
    producerId = crop.farm.producer.id;
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
