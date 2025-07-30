import { Injectable } from '@nestjs/common';
import { IDashboardRepository } from '../interfaces/dashboard.repository';
import { PrismaService } from '@/resources/database/prisma/prisma.service';
import { DashboardFilterDto, DashboardResponseDto } from '../../presentation/dtos/get.dto';

@Injectable()
export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardData(filters: DashboardFilterDto): Promise<DashboardResponseDto> {
    const { producerId, state, cropName } = filters;

    const whereFarm: any = {};
    if (producerId) whereFarm.producerId = producerId;
    if (state) whereFarm.state = state;

    const totalFarms = await this.prisma.farm.count({ where: whereFarm });

    const totalHectaresResult = await this.prisma.farm.aggregate({
      where: whereFarm,
      _sum: {
        totalArea: true,
        arableArea: true,
        vegetationArea: true,
      },
    });


    const farmsByState = await this.prisma.farm.groupBy({
      by: ['state'],
      where: whereFarm,
      _count: { state: true },
    });

    const whereCrop: any = {};
    if (cropName) whereCrop.name = cropName;
    if (producerId) {
      const farms = await this.prisma.farm.findMany({
        where: { producerId },
        select: { id: true },
      });
      const farmIds = farms.map(f => f.id);
      whereCrop.farmId = { in: farmIds };
    }

    const cropsDistribution = await this.prisma.crop.groupBy({
      by: ['name'],
      where: whereCrop,
      _count: { name: true },
    });

    return {
      totalFarms,
      totalHectares: totalHectaresResult._sum.totalArea ?? 0,

      farmsByState: farmsByState.map(f => ({
        state: f.state,
        count: f._count.state,
      })),

      cropsDistribution: cropsDistribution.map(c => ({
        name: c.name,
        count: c._count.name,
      })),

      landUseDistribution: [
        {
          label: 'Área Agricultável',
          value: totalHectaresResult._sum.arableArea ?? 0,
        },
        {
          label: 'Área de Vegetação',
          value: totalHectaresResult._sum.vegetationArea ?? 0,
        },
      ],
    };

  }
}