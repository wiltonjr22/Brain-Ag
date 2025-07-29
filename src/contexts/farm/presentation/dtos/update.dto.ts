import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class UpdateFarmDto {
  @ApiPropertyOptional({ example: 'Fazenda Nova Aliança' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Uberaba' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'MG' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 120.0 })
  @IsOptional()
  @IsNumber()
  totalArea?: number;

  @ApiPropertyOptional({ example: 80.0 })
  @IsOptional()
  @IsNumber()
  arableArea?: number;

  @ApiPropertyOptional({ example: 20.0 })
  @IsOptional()
  @IsNumber()
  vegetationArea?: number;

  @ApiPropertyOptional({ example: 'f88cba4d-bbd7-49b1-8451-cdd3c94b84f6' })
  @IsOptional()
  @IsUUID()
  producerId?: string;
}
