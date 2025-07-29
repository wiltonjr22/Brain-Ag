import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({
    description: 'Ano da safra',
    example: 2025,
  })
  @IsInt()
  @Min(1900)
  year: number;
}
