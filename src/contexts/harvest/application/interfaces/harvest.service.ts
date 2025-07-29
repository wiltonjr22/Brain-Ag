import { CreateHarvestDto } from '../../presentation/dtos/create.dto';
import { UpdateHarvestDto } from '../../presentation/dtos/update.dto';
import { HarvestFilterDto } from '../../presentation/dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

export interface IHarvestService {
  create(dto: CreateHarvestDto): Promise<void>;
  findAll(filter: HarvestFilterDto): Promise<{ data: HarvestEntity[]; total: number }>;
  findOne(id: string): Promise<HarvestEntity>;
  update(id: string, dto: UpdateHarvestDto): Promise<HarvestEntity>;
  remove(id: string): Promise<void>;
}
