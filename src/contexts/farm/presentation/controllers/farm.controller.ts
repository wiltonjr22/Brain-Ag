import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { CreateFarmDto } from '../../presentation/dtos/create.dto';
import { UpdateFarmDto } from '../../presentation/dtos/update.dto';
import { IFarmService } from '../../application/interfaces/farm.service';
import { FarmFilterDto } from '../dtos/get.dto';
import { FarmEntity } from '../../commom/entities/communication.entities';

@ApiTags('Fazendas')
  @Controller('fazendas')
export class FarmController {
  private readonly logger = new Logger(FarmController.name);

  constructor(private readonly farmService: IFarmService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.' })
  async create(@Body() dto: CreateFarmDto): Promise<void> {
    this.logger.log('Received request to create a new farm');
    return this.farmService.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'producerId', required: false, description: 'Filtrar por id de produtor', example: 'f88cba4d-bbd7-49b1-8451-cdd3c94b84f6' })
  @ApiQuery({ name: 'city', required: false, description: 'Filtrar por cidade', example: 'Fortaleza' })
  @ApiQuery({ name: 'state', required: false, description: 'Filtrar por estado', example: 'CE' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Número de itens a pular (offset)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Número máximo de itens por página' })
  @ApiOperation({ summary: 'Listar fazendas com filtros opcionais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas retornada com sucesso.',
  })
  async findAll(
    @Query() filter: FarmFilterDto,
  ): Promise<{ data: FarmEntity[]; total: number }> {
    this.logger.log('Received request to list farms with filters');
    return this.farmService.findAll(filter);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID da fazenda', example: 'uuid' })
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda retornada com sucesso.' })
  async findOne(@Param('id') id: string): Promise<FarmEntity> {
    this.logger.log(`Fetching farm with ID: ${id}`);
    return this.farmService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID da fazenda', example: 'uuid' })
  @ApiOperation({ summary: 'Atualizar uma fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
  ): Promise<FarmEntity> {
    this.logger.log(`Updating farm with ID: ${id}`);
    return this.farmService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'ID da fazenda', example: 'uuid' })
  @ApiOperation({ summary: 'Remover uma fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda removida com sucesso.' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting farm with ID: ${id}`);
    await this.farmService.remove(id);
  }
}
