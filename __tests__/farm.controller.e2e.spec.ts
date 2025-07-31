import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { CreateFarmDto } from '@/contexts/farm/presentation/dtos/create.dto';

describe('FarmController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdFarmId: string;
  let producerId: string;
  let farmIdToDelete: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get(PrismaService);
    const producer = await prisma.producer.findFirst();
    producerId = producer!.id;

    prisma = moduleRef.get(PrismaService);
    const farmId = await prisma.farm.findFirst();
    createdFarmId = farmId!.id;

    prisma = moduleRef.get(PrismaService);
    const farmIdWithNoCrops = await prisma.farm.findFirst({
      where: {
        name: 'Fazenda abaiara',
        city: 'milagres',
        state: 'Ce',
      },
    });
    farmIdToDelete = farmIdWithNoCrops!.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/farms (POST) should create a farm', async () => {
    const dto: CreateFarmDto = {
      name: 'Fazenda E2E',
      city: 'Campo Novo',
      state: 'SP',
      totalArea: 100,
      arableArea: 70,
      vegetationArea: 30,
      producerId,
    };

    const res = await request(app.getHttpServer())
      .post('/farms')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/farms (GET) should list all farms', async () => {
    const res = await request(app.getHttpServer())
      .get('/farms')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/farms/:id (GET) should return a farm by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/farms/${createdFarmId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdFarmId);
  });

  it('/farms/:id (PATCH) should update a farm', async () => {
    const updatedName = 'Fazenda Atualizada';
    const res = await request(app.getHttpServer())
      .patch(`/farms/${createdFarmId}`)
      .send({ name: updatedName })
      .expect(200);

    expect(res.body.name).toBe(updatedName);
  });

  it('/farms/:id (DELETE) should delete a farm', async () => {// todo verificar com minha seed
    await request(app.getHttpServer())
      .delete(`/farms/${createdFarmId}`)
      .expect(204);

    const res = await request(app.getHttpServer())
      .get(`/farms/${createdFarmId}`)
      .expect(404);
  });
});
