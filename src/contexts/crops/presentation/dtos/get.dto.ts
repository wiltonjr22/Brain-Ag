import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString } from 'class-validator';

export class CropFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar pelo nome da cultura', example: 'Milho' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID da fazenda', example: 'uuid-farm' })
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID da safra', example: 'uuid-harvest' })
  @IsOptional()
  @IsUUID()
  harvestId?: string;

  @ApiPropertyOptional({ description: 'Número máximo de itens por página', example: 10, default: 10 })
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Número de itens para pular (offset da paginação)', example: 0, default: 0 })
  @IsOptional()
  offset?: number = 0;
}