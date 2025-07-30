import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { DocType } from '../../commom/entities/producer.entities';
import { IsValidDocumentUpdateStrict } from '../../commom/validators/valid-cpf-cnpj-update';

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

  @ApiPropertyOptional({
    enum: DocType,
    example: DocType.CPF,
    description: 'Tipo de documento do produtor (CPF ou CNPJ)',
  })
  @IsOptional()
  @IsEnum(DocType)
  docType?: DocType;

  @IsValidDocumentUpdateStrict({ message: 'Os campos document e docType devem ser enviados juntos e válidos para atualização' })
  validateDocumentUpdate?: any;
}
