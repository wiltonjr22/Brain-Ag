import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DashboardFilterDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'ID do produtor' })
  producerId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'UF do estado (ex: MG, SP)' })
  state?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nome da cultura (ex: Soja)' })
  cropName?: string;
}


export class DashboardResponseDto {
  totalFarms: number;
  totalHectares: number;

  farmsByState: { state: string; count: number }[];
  cropsDistribution: { name: string; count: number }[];
  landUseDistribution: { label: string; value: number }[];
}
