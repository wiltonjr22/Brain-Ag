import { Expose, Type } from 'class-transformer';
import { IsUUID, IsInt, IsDate } from 'class-validator';

export abstract class HarvestFactoryEntity {
  @Expose()
  @IsInt()
  year: number;
}

export class HarvestEntity extends HarvestFactoryEntity {
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
