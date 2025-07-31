import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';

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

  @ApiPropertyOptional({ description: 'Limite de itens por página', example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Offset para paginação', example: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number = 0;
}