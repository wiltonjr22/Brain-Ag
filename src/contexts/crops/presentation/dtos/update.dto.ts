import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class UpdateCropDto {
  @ApiPropertyOptional({ description: 'Nome da cultura', example: 'Milho' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ID da fazenda', example: 'uuid-farm' })
  @IsOptional()
  @IsUUID()
  farmId?: string;

  @ApiPropertyOptional({ description: 'ID da safra', example: 'uuid-harvest' })
  @IsOptional()
  @IsUUID()
  harvestId?: string;
}