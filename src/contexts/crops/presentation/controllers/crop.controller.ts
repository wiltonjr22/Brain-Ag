import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { CreateCropDto } from '../dtos/create.dto';
import { UpdateCropDto } from '../dtos/update.dto';
import { CropFilterDto } from '../dtos/get.dto';
import { CropEntity } from '../../commom/entities/crops.entities';
import { ICropService } from '../../application/interfaces/crops.service';

@ApiTags('Culturas')
@Controller('crops')
export class CropController {
  private readonly logger = new Logger(CropController.name);

  constructor(private readonly cropService: ICropService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso.' })
  async create(@Body() dto: CreateCropDto): Promise<void> {
    this.logger.log('Received request to create a new crop');
    return this.cropService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar culturas com filtros opcionais' })
  @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome da cultura', example: 'Milho' })
  @ApiQuery({ name: 'farmId', required: false, description: 'Filtrar por ID da fazenda', example: 'uuid-farm' })
  @ApiQuery({ name: 'harvestId', required: false, description: 'Filtrar por ID da safra', example: 'uuid-harvest' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de itens por página', example: 10, type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'Número de itens para pular (offset)', example: 0, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de culturas retornada com sucesso.' })
  async findAll(@Query() filter: CropFilterDto): Promise<{ data: CropEntity[]; total: number }> {
    this.logger.log('Received request to list crops with filters');
    return this.cropService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiParam({ name: 'id', description: 'ID da cultura', example: 'uuid-crop' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  async findOne(@Param('id') id: string): Promise<CropEntity> {
    this.logger.log(`Received request to get crop with ID: ${id}`);
    return this.cropService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar cultura' })
  @ApiParam({ name: 'id', description: 'ID da cultura', example: 'uuid-crop' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCropDto): Promise<CropEntity> {
    this.logger.log(`Received request to update crop with ID: ${id}`);
    return this.cropService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cultura' })
  @ApiParam({ name: 'id', description: 'ID da cultura', example: 'uuid-crop' })
  @ApiResponse({ status: 204, description: 'Cultura excluída com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Received request to delete crop with ID: ${id}`);
    return this.cropService.remove(id);
  }
}
