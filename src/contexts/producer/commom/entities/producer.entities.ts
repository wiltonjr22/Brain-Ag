import { Expose } from "class-transformer";
import { IsEnum, IsString, IsBoolean, IsUUID, IsDate } from "class-validator";

export enum DocType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export abstract class ProducerFactoryEntity {
  @Expose()
  @IsEnum(DocType)
  docType: DocType;

  @Expose()
  @IsString()
  document: string;

  @Expose()
  @IsString()
  name: string;

}

export class ProducerEntity extends ProducerFactoryEntity {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
