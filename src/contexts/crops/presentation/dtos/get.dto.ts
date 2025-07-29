import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';

export class CropFilterDto {
  @ApiPropertyOptional({ description: 'Nome da cultura', example: 'Algodão' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ID da fazenda associada', example: 'uuid-farm' })
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional({ description: 'Limite de itens por página', example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Itens a pular (offset)', example: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;
}
