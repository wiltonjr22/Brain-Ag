import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

export abstract class IHarvestRepository {
  abstract create(data: CreateHarvestDto): Promise<void>;
  abstract findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }>;
  abstract findOne(id: string): Promise<HarvestEntity | null>;
  abstract update(id: string, data: UpdateHarvestDto): Promise<HarvestEntity>;
  abstract remove(id: string): Promise<void>;
}
