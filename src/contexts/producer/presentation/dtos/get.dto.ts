import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { DocType } from '../../commom/entities/producer.entities';

export class ProducerFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por nome do produtor', example: 'João da Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por documento (CPF ou CNPJ)', example: '12345678900' })
  @IsOptional()
  @IsString()
  document?: string;//todo fazer validação de CPF e CNPJ

  @ApiPropertyOptional({ description: 'Filtrar por tipo de documento', enum: DocType, example: DocType.CPF })
  @IsOptional()
  @IsEnum(DocType)
  docType?: DocType;

  @ApiPropertyOptional({ description: 'Data de criação inicial (ISO 8601)', example: '2025-07-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  createdAtStart?: string;

  @ApiPropertyOptional({ description: 'Data de criação final (ISO 8601)', example: '2025-07-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  createdAtEnd?: string;

  @ApiPropertyOptional({ description: 'Número máximo de itens por página', example: 10, default: 10, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Número de itens para pular (offset da paginação)', example: 0, default: 0, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
