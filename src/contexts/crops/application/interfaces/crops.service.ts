import { CreateCropDto } from '../../presentation/dtos/create.dto';
import { UpdateCropDto } from '../../presentation/dtos/update.dto';
import { CropFilterDto } from '../../presentation/dtos/get.dto';
import { CropEntity } from '../../commom/entities/crops.entities';

export abstract class ICropService {
  abstract create(dto: CreateCropDto): Promise<void>;
  abstract findAll(filter: CropFilterDto): Promise<{ data: CropEntity[]; total: number }>;
  abstract findOne(id: string): Promise<CropEntity>;
  abstract update(id: string, dto: UpdateCropDto): Promise<CropEntity>;
  abstract remove(id: string): Promise<void>;
}
