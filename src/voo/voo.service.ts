import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Voo } from './voo.entity';
import { Localidade } from '../localidade/localidade.entity';
import { addMinutes, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class VooService {
  constructor(
    @InjectRepository(Voo)
    private readonly vooRepository: Repository<Voo>,
  ) {}

  // Criar um novo voo
  async criarVoo(origem: Localidade, destino: Localidade, data: Date): Promise<Voo> {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

    const voosProximos = await this.vooRepository.find({
      where: { data: Between(addMinutes(data, -30), addMinutes(data, 30)) },
    });

    if (voosProximos.length > 0) {
      throw new ConflictException('Já existe um voo nesse intervalo de tempo.');
    }

    const vooMesmoDestino = await this.vooRepository.findOne({
      where: {
        destino: { id: destino.id }, // Usar ID da localidade
        data: Between(startOfDay(data), endOfDay(data)),
      },
    });

    if (vooMesmoDestino) {
      throw new ConflictException('Já existe um voo para o mesmo destino neste dia.');
    }

    const novoVoo = this.vooRepository.create({
      codigo,
      origem,
      destino,
      data,
    });

    return await this.vooRepository.save(novoVoo);
  }

  // Obter todos os voos
  async findAll(): Promise<Voo[]> {
    return this.vooRepository.find({ relations: ['origem', 'destino'] });
  }

  // Obter um voo por ID
  async findOne(id: number): Promise<Voo> {
    const voo = await this.vooRepository.findOne({ where: { id }, relations: ['origem', 'destino'] });
    if (!voo) {
      throw new NotFoundException(`Voo com ID ${id} não encontrado.`);
    }
    return voo;
  }

  // Editar um voo
  async updateVoo(id: number, updateData: Partial<Voo>): Promise<Voo> {
    const voo = await this.findOne(id);

    if (updateData.data) {
      const voosProximos = await this.vooRepository.find({
        where: { data: Between(addMinutes(updateData.data, -30), addMinutes(updateData.data, 30)) },
      });

      if (voosProximos.length > 0 && !voosProximos.some(v => v.id === voo.id)) {
        throw new ConflictException('Já existe um voo nesse intervalo de tempo.');
      }

      if (updateData.destino) {
        const vooMesmoDestino = await this.vooRepository.findOne({
          where: {
            destino: { id: updateData.destino.id }, // Usar ID da localidade
            data: Between(startOfDay(updateData.data), endOfDay(updateData.data)),
          },
        });

        if (vooMesmoDestino && vooMesmoDestino.id !== voo.id) {
          throw new ConflictException('Já existe um voo para o mesmo destino neste dia.');
        }
      }
    }

    Object.assign(voo, updateData);
    return await this.vooRepository.save(voo);
  }

  // Deletar um voo
  async deleteVoo(id: number): Promise<void> {
    const voo = await this.findOne(id);
    await this.vooRepository.remove(voo);
  }
}
