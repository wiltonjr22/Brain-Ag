import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({ description: 'Nome da cultura', example: 'Soja' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID da fazenda associada', example: 'uuid-farm' })
  @IsUUID()
  farmId: string;
}
