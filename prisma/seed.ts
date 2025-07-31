import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.crop.deleteMany();
  await prisma.harvest.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.producer.deleteMany();

  const harvest2023 = await prisma.harvest.create({ data: { year: 2023 } });
  const harvest2024 = await prisma.harvest.create({ data: { year: 2024 } });

  const producerCPF = await prisma.producer.create({
    data: {
      name: 'João da Silva',
      docType: 'CPF',
      document: '12345678900',
    },
  });

  const producerCNPJ = await prisma.producer.create({
    data: {
      name: 'AgroTech LTDA',
      docType: 'CNPJ',
      document: '12345678000100',
    },
  });

  const farmMG = await prisma.farm.create({
    data: {
      name: 'Fazenda São Pedro',
      city: 'Uberlândia',
      state: 'MG',
      totalArea: 100,
      arableArea: 70,
      vegetationArea: 30,
      producerId: producerCPF.id,
    },
  });

  const farmSP = await prisma.farm.create({
    data: {
      name: 'Fazenda Boa Vista',
      city: 'Ribeirão Preto',
      state: 'SP',
      totalArea: 80,
      arableArea: 50,
      vegetationArea: 30,
      producerId: producerCPF.id,
    },
  });

  const farmMT = await prisma.farm.create({
    data: {
      name: 'Fazenda Pantanal',
      city: 'Cuiabá',
      state: 'MT',
      totalArea: 120,
      arableArea: 90,
      vegetationArea: 30,
      producerId: producerCNPJ.id,
    },
  });

  const farmBA = await prisma.farm.create({
    data: {
      name: 'Fazenda Chapada',
      city: 'Barreiras',
      state: 'BA',
      totalArea: 150,
      arableArea: 100,
      vegetationArea: 50,
      producerId: producerCNPJ.id,
    },
  });

  await prisma.farm.create({
    data: {
      name: 'Fazenda abaiara',
      city: 'milagres',
      state: 'Ce',
      totalArea: 150,
      arableArea: 100,
      vegetationArea: 50,
      producerId: producerCNPJ.id,
    },
  });

  const crops = [
    { name: 'Soja', farmId: farmMG.id },
    { name: 'Milho', farmId: farmSP.id },
    { name: 'Algodão', farmId: farmMT.id },
    { name: 'Cana-de-açúcar', farmId: farmBA.id },
  ];

  for (const crop of crops) {
    await prisma.crop.createMany({
      data: [
        { ...crop, harvestId: harvest2023.id },
        { ...crop, harvestId: harvest2024.id },
      ],
    });
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
