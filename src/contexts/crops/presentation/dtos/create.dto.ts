import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ description: 'Nome da cultura', example: 'Milho' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID da fazenda', example: 'uuid-farm' })
  @IsUUID()
  farmId: string;

  @ApiProperty({ description: 'ID da safra', example: 'uuid-harvest' })
  @IsUUID()
  harvestId: string;
}