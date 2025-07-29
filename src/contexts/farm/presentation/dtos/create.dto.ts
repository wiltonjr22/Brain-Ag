import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({ example: 'Fazenda Boa Esperança' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Ribeirão Preto' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  state: string;

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  totalArea: number;

  @ApiProperty({ example: 60.3 })
  @IsNumber()
  arableArea: number;

  @ApiProperty({ example: 30.2 })
  @IsNumber()
  vegetationArea: number;

  @ApiProperty({ example: 'e6d7f310-1344-4c23-b8b1-6a4a70ee7f7d' })
  @IsUUID()
  producerId: string;
}
