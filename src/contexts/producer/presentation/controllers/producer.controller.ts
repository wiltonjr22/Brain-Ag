import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { IProducerService } from '../../application/interfaces/producer.service';
import { CreateProducerDto } from '../dtos/create.dto';
import { UpdateProducerDto } from '../dtos/update.dto';

@ApiTags('Produtores')
@Controller('produtores')
export class ProducerController {
  private readonly logger = new Logger(ProducerController.name);

  constructor(private readonly communicationService: IProducerService) { }

  @Post()
  @ApiOperation({ summary: 'Criar produtor rural' })
  @ApiBody({ type: CreateProducerDto })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  async create(@Body() dto: CreateProducerDto) {
    this.logger.log('Requisição recebida para criar um produtor.');
    return this.communicationService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.' })
  async findAll() {
    this.logger.log('Requisição recebida para listar produtores.');
    return this.communicationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Requisição recebida para buscar produtor com ID: ${id}`);
    return this.communicationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiBody({ type: UpdateProducerDto })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async update(@Param('id') id: string, @Body() dto: UpdateProducerDto) {
    this.logger.log(`Requisição recebida para atualizar produtor com ID: ${id}`);
    return this.communicationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir produtor por ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor', example: 'uuid-produtor' })
  @ApiResponse({ status: 200, description: 'Produtor excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async remove(@Param('id') id: string) {
    this.logger.log(`Requisição recebida para excluir produtor com ID: ${id}`);
    return this.communicationService.remove(id);
  }
}
