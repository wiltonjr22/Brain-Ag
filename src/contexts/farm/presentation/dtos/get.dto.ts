import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer'; // ⬅️ importante!

export class FarmFilterDto {
  @ApiPropertyOptional({ description: 'ID do produtor', example: 'f88cba4d-bbd7-49b1-8451-cdd3c94b84f6' })
  @IsOptional()
  @IsUUID()
  producerId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por cidade', example: 'Barretos' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado', example: 'GO' })
  @IsOptional()
  @IsString()
  state?: string;

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
