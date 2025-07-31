import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('HarvestController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdHarvestId: string;
  let harvestToDeleteId: string
  let harvestWithCropsId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
    prisma = moduleRef.get(PrismaService);
    const harvesId = await prisma.harvest.findFirst();
    createdHarvestId = harvesId!.id;

    const harvestToDelete = await prisma.harvest.findFirst({ where: { year: 2025 } });
    harvestToDeleteId = harvestToDelete!.id;

    const harvestWithCrops = await prisma.harvest.findFirst({ where: { year: 2023 } });
    harvestWithCropsId = harvestWithCrops!.id;

  });

  afterAll(async () => {
    await app.close();
  });

  it('/harvests (POST) should create a harvest', async () => {
    const dto = { year: 2026 };

    const res = await request(app.getHttpServer())
      .post('/harvests')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/harvests (GET) should return a list of harvests', async () => {
    const res = await request(app.getHttpServer())
      .get('/harvests')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/harvests/:id (GET) should return a harvest by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/harvests/${createdHarvestId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdHarvestId);
  });

  it('/harvests/:id (PATCH) should update a harvest', async () => {
    const updatedYear = 2027;
    const res = await request(app.getHttpServer())
      .patch(`/harvests/${createdHarvestId}`)
      .send({ year: updatedYear })
      .expect(200);

    expect(res.body.year).toBe(updatedYear);
  });

  it('/harvests/:id (DELETE) should delete a harvest with no crops', async () => {
    await request(app.getHttpServer())
      .delete(`/harvests/${harvestToDeleteId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/harvests/${harvestToDeleteId}`)
      .expect(404);
  });

  it('/harvests/:id (DELETE) should fail to delete a harvest with crops', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/harvests/${harvestWithCropsId}`)
      .expect(500);

    expect(res.body.message).toMatch(/associated crops/i);
  });
});