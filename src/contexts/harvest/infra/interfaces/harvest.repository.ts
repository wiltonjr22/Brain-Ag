import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

export interface IHarvestRepository {
  create(data: CreateHarvestDto): Promise<void>;
  findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }>;
  findById(id: string): Promise<HarvestEntity | null>;
  update(id: string, data: UpdateHarvestDto): Promise<HarvestEntity>;
  remove(id: string): Promise<void>;
}
