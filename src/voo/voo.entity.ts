import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Localidade } from '../localidade/localidade.entity';

@Entity()
export class Voo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @ManyToOne(() => Localidade, { eager: true })
  origem: Localidade;

  @ManyToOne(() => Localidade, { eager: true })
  destino: Localidade;

  @Column({ type: 'timestamp' })
  data: Date;
}
