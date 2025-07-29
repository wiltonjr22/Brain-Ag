import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { DocType } from '../../commom/entities/producer.entities';

export class UpdateProducerDto {
  @ApiPropertyOptional({
    description: 'Nome do produtor rural',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Documento (CPF ou CNPJ)',
    example: '12345678900',
  })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiProperty({
    enum: DocType,
    example: DocType.CPF,
    description: 'Tipo de documento do produtor (CPF ou CNPJ)',
  })
  @IsOptional()
  @IsEnum(DocType)
  docType?: DocType;
}
