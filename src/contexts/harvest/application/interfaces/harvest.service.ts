import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

export abstract class IHarvestService {
  abstract create(dto: CreateHarvestDto): Promise<void>;
  abstract findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }>;
  abstract findOne(id: string): Promise<HarvestEntity>;
  abstract update(id: string, dto: UpdateHarvestDto): Promise<HarvestEntity>;
  abstract remove(id: string): Promise<void>;
}
