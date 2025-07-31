import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('CropController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdCropId: string;
  let farmId: string;
  let harvestId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);

    const farm = await prisma.farm.findFirst();
    farmId = farm?.id;

    const harvest = await prisma.harvest.findFirst();
    harvestId = harvest?.id;


    prisma = moduleRef.get(PrismaService);
    const cropId = await prisma.crop.findFirst();
    createdCropId = cropId!.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/crops (POST) should create a crop', async () => {
    const dto = {
      name: 'Milho E2E',
      farmId,
      harvestId,
    };

    const res = await request(app.getHttpServer())
      .post('/crops')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/crops (GET) should list all crops', async () => {
    const res = await request(app.getHttpServer())
      .get('/crops')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/crops/:id (GET) should return a crop by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/crops/${createdCropId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdCropId);
  });

  it('/crops/:id (PATCH) should update a crop', async () => {
    const newName = 'Milho E2E Atualizado';

    const res = await request(app.getHttpServer())
      .patch(`/crops/${createdCropId}`)
      .send({ name: newName })
      .expect(200);

    expect(res.body.name).toBe(newName);
  });

  it('/crops/:id (DELETE) should delete a crop', async () => {
    await request(app.getHttpServer())
      .delete(`/crops/${createdCropId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/crops/${createdCropId}`)
      .expect(404);
  });
});
