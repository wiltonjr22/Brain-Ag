import { Expose, Type } from 'class-transformer';
import { IsUUID, IsString, IsDate } from 'class-validator';

export abstract class CropFactoryEntity {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsUUID()
  farmId: string;

  @Expose()
  @IsUUID()
  harvestId: string;
}

export class CropEntity extends CropFactoryEntity {
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
