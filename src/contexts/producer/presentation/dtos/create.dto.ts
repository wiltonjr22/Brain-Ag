import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DocType } from '../../commom/entities/producer.entities';
import { IsValidDocument } from '../../commom/validators/valid-cpf-cnpj';

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
  @IsValidDocument('docType', {
    message: 'Documento inválido para o tipo informado'
  })
  document: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do produtor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
