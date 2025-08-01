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

import { IHarvestService } from '../../application/interfaces/harvest.service';
import { CreateHarvestDto } from '../dtos/create.dto';
import { UpdateHarvestDto } from '../dtos/update.dto';
import { HarvestFilterDto } from '../dtos/get.dto';
import { HarvestEntity } from '../../commom/entities/harvest.entities';

@ApiTags('Safras')
  @Controller('safras')
export class HarvestController {
  private readonly logger = new Logger(HarvestController.name);

  constructor(private readonly harvestService: IHarvestService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso.' })
  async create(@Body() dto: CreateHarvestDto): Promise<void> {
    this.logger.log('Received request to create a new harvest');
    return this.harvestService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'year', required: false, example: 2025, description: 'Filtrar por ano da safra' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Número máximo de itens por página' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Número de itens para pular (offset da paginação)' })
  @ApiOperation({ summary: 'Listar todas as safras com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de safras retornada com sucesso.' })
  async findAll(
    @Query() filter: HarvestFilterDto,
  ): Promise<{ data: HarvestEntity[]; total: number }> {
    this.logger.log('Received request to list harvests with filters');
    return this.harvestService.findAll(filter);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da safra', example: 'uuid-harvest' })
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  async findOne(@Param('id') id: string): Promise<HarvestEntity> {
    this.logger.log(`Fetching harvest with ID: ${id}`);
    return this.harvestService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da safra', example: 'uuid-harvest' })
  @ApiOperation({ summary: 'Atualizar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHarvestDto,
  ): Promise<HarvestEntity> {
    this.logger.log(`Updating harvest with ID: ${id}`);
    return this.harvestService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'ID da safra', example: 'uuid-harvest' })
  @ApiOperation({ summary: 'Excluir safra por ID' })
  @ApiResponse({ status: 204, description: 'Safra excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada.' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting harvest with ID: ${id}`);
    await this.harvestService.remove(id);
  }
}
