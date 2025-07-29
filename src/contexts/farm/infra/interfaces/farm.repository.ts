import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { FarmFilterDto } from '../../presentation/dtos/get.dto';
import { FarmEntity } from '../../commom/entities/communication.entities';

export abstract class IFarmRepository {
  abstract create(data: CreateFarmDto): Promise<void>;
  abstract findAll(filter: FarmFilterDto): Promise<{ data: FarmEntity[]; total: number }>;
  abstract findById(id: string): Promise<FarmEntity | null>;
  abstract update(id: string, data: UpdateFarmDto): Promise<FarmEntity>;
  abstract remove(id: string): Promise<void>;
}
