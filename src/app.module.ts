import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voo } from './voo/voo.entity';
import { Localidade } from './localidade/localidade.entity';
import { VooModule } from './voo/voo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '0816',
      database: 'flights_db',
      entities: [Voo, Localidade],
      synchronize: true,
    }),
    VooModule,
  ],
})
export class AppModule {}
