import { Controller, Post, Body, Get, Put, Param, Delete } from '@nestjs/common';
import { VooService } from './voo.service';
import { Voo } from './voo.entity';
import { Localidade } from '../localidade/localidade.entity';

@Controller('voos')
export class VooController {
  constructor(private readonly vooService: VooService) {}

  @Get()
  async listarVoos(): Promise<Voo[]> {
    return await this.vooService.findAll(); // Chamando o método correto
  }

  @Post()
  async criarVoo(
    @Body() body: { origem: Localidade; destino: Localidade; data: Date }
  ) {
    return await this.vooService.criarVoo(body.origem, body.destino, body.data);
  }

  @Put(':id')
  async editarVoo(
    @Param('id') id: string,
    @Body() vooData: Partial<Voo>,
  ) {
    return await this.vooService.updateVoo(+id, vooData); // Chamando o método correto
  }

  @Delete(':id')
  async deletarVoo(@Param('id') id: string) {
    return await this.vooService.deleteVoo(+id); // Usando o nome correto
  }
}
