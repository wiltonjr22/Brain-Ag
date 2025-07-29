import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IProducerService } from '../../application/interfaces/producer.service';
import { CreateProducerDto } from '../dtos/create.dto';
import { UpdateProducerDto } from '../dtos/update.dto';
import { ProducerFilterDto } from '../dtos/get.dto';
import { ProducerEntity } from '../../commom/entities/producer.entities';

@ApiTags('Produtores')
@Controller('produtores')
export class ProducerController {
  private readonly logger = new Logger(ProducerController.name);

  constructor(private readonly producerService: IProducerService) { }

  @Post()
  @ApiOperation({ summary: 'Criar produtor rural' })
  @ApiBody({ type: CreateProducerDto })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  async create(@Body() dto: CreateProducerDto) {
    this.logger.log('Request received to create a new producer.');
    return this.producerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.' })
  @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome do produtor', example: 'João da Silva' })
  @ApiQuery({ name: 'document', required: false, description: 'Filtrar por CPF ou CNPJ', example: '12345678900' })
  @ApiQuery({ name: 'docType', required: false, description: 'Filtrar por tipo de documento (CPF ou CNPJ)', example: 'CPF' })
  @ApiQuery({ name: 'active', required: false, description: 'Filtrar por status ativo/inativo', example: true })
  @ApiQuery({ name: 'createdAtStart', required: false, description: 'Data de criação inicial (formato ISO)', example: '2025-07-01T00:00:00.000Z' })
  @ApiQuery({ name: 'createdAtEnd', required: false, description: 'Data de criação final (formato ISO)', example: '2025-07-31T23:59:59.000Z' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de itens por página', example: 10, type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'Número de itens para pular (offset da paginação)', example: 0, type: Number })
  async findAll(
    @Query() filter: ProducerFilterDto,
  ): Promise<{ data: ProducerEntity[]; total: number }> {
    this.logger.log('Request received to list producers with filters.');
    return this.producerService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Request received to find producer with ID: ${id}`);
    return this.producerService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiBody({ type: UpdateProducerDto })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    this.logger.log(`Request received to update producer with ID: ${id}`);
    return this.producerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiResponse({ status: 200, description: 'Produtor excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Request received to delete producer with ID: ${id}`);
    return this.producerService.remove(id);
  }
}
