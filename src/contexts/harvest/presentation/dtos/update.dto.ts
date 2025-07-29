import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateHarvestDto {
  @ApiPropertyOptional({
    description: 'Ano da safra',
    example: 2025,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;
}
