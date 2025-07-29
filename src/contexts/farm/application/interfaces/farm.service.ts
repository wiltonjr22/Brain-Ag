import { FarmEntity } from "../../commom/entities/communication.entities";
import { CreateFarmDto } from "../../presentation/dtos/create.dto";
import { FarmFilterDto } from "../../presentation/dtos/get.dto";
import { UpdateFarmDto } from "../../presentation/dtos/update.dto";


export abstract class IFarmService {
  abstract create(dto: CreateFarmDto): Promise<void>;
  abstract findAll(filter: FarmFilterDto): Promise<{ data: FarmEntity[]; total: number }>;
  abstract findOne(id: string): Promise<FarmEntity>;
  abstract update(id: string, dto: UpdateFarmDto): Promise<FarmEntity>;
  abstract remove(id: string): Promise<void>;
}
