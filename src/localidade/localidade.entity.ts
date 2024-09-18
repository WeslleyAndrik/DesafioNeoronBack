import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Localidade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cep: string;

  @Column()
  pais: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;
}
