import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class GetProducerDto {
  @ApiProperty({ description: 'ID do produtor', format: 'uuid' })
  @Expose()
  @IsUUID()
  id: string;
}
