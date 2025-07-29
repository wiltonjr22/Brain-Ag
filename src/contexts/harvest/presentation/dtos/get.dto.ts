import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class HarvestFilterDto {
  @ApiPropertyOptional({
    description: 'Ano da safra para filtro',
    example: 2025,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @ApiPropertyOptional({
    description: 'Número máximo de itens por página',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Número de itens para pular (offset da paginação)',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  offset?: number = 0;
}
