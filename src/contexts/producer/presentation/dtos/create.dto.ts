import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocType } from '../../commom/entities/producer.entities';

export class CreateProducerDto {
  @ApiProperty({
    enum: DocType,
    example: DocType.CPF,
    description: 'Tipo de documento do produtor (CPF ou CNPJ)',
  })
  @IsEnum(DocType)
  @IsNotEmpty()
  docType: DocType;

  @ApiProperty({
    example: '12345678909',
    description: 'Número do CPF ou CNPJ do produtor',
  })
  @IsString()
  @IsNotEmpty()
  document: string; //todo fazer validação de CPF e CNPJ

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do produtor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
