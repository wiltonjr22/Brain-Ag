import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class UpdateCropDto {
  @ApiPropertyOptional({ description: 'Novo nome da cultura', example: 'Milho' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ID da fazenda associada', example: 'uuid-farm' })
  @IsOptional()
  @IsUUID()
  farmId?: string;
}
