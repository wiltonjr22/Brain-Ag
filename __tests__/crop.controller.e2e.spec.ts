import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/resources/database/prisma/prisma.service';

describe('CropController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let producerId: string;
  let farmId: string;
  let harvestId: string;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpa tabelas na ordem correta para evitar FK violations
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.producer.deleteMany();

    // Cria produtor único
    const uniqueDoc = `doc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const producer = await prisma.producer.create({
      data: {
        name: 'Produtor E2E',
        document: uniqueDoc,
        docType: 'CPF',
      },
    });
    producerId = producer.id;

    // Cria fazenda vinculada ao produtor
    const farm = await prisma.farm.create({
      data: {
        name: 'Fazenda E2E',
        city: 'Cidade Teste',
        state: 'ST',
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
        producerId,
      },
    });
    farmId = farm.id;

    // Cria safra
    const harvest = await prisma.harvest.create({
      data: {
        year: new Date().getFullYear(),
      },
    });
    harvestId = harvest.id;
  });

  afterAll(async () => {
    await prisma.crop.deleteMany();
    await prisma.farm.deleteMany();
    await prisma.harvest.deleteMany();
    await prisma.producer.deleteMany();
    await app.close();
  });

  it('/POST culturas', async () => {
    const dto = {
      name: 'Milho E2E',
      farmId,
      harvestId,
    };

    const res = await request(app.getHttpServer())
      .post('/culturas')
      .send(dto)
      .expect(201);

    expect(res.body).toEqual({});
  });

  it('/GET culturas should return a list of crops', async () => {
    // Criar uma cultura para garantir que exista
    await prisma.crop.create({
      data: {
        name: 'Milho E2E',
        farmId,
        harvestId,
      },
    });

    const res = await request(app.getHttpServer())
      .get('/culturas')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('/GET culturas/:id', async () => {
    // Criar cultura para teste
    const crop = await prisma.crop.create({
      data: {
        name: 'Milho E2E',
        farmId,
        harvestId,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/culturas/${crop.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', crop.id);
  });

  it('/PATCH culturas/:id', async () => {
    // Criar cultura para teste
    const crop = await prisma.crop.create({
      data: {
        name: 'Milho E2E',
        farmId,
        harvestId,
      },
    });

    const newName = 'Milho E2E Atualizado';

    const res = await request(app.getHttpServer())
      .patch(`/culturas/${crop.id}`)
      .send({ name: newName })
      .expect(200);

    expect(res.body.name).toBe(newName);
  });

  it('/DELETE culturas/:id', async () => {
    // Criar cultura para teste
    const crop = await prisma.crop.create({
      data: {
        name: 'Milho E2E',
        farmId,
        harvestId,
      },
    });

    await request(app.getHttpServer())
      .delete(`/culturas/${crop.id}`)
      .expect(204);
  });
});
