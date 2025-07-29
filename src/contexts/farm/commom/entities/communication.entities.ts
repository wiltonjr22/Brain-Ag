import { Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsNumber, IsDate } from 'class-validator';

export abstract class FarmFactoryEntity {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  state: string;

  @Expose()
  @IsNumber()
  totalArea: number;

  @Expose()
  @IsNumber()
  arableArea: number;

  @Expose()
  @IsNumber()
  vegetationArea: number;

  @Expose()
  @IsUUID()
  producerId: string;
}

export class FarmEntity extends FarmFactoryEntity {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
