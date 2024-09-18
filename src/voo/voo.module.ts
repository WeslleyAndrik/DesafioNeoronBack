import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VooService } from "./voo.service";
import { VooController } from "./voo.controller";
import { Voo } from "./voo.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Voo])],
  providers: [VooService],
  controllers: [VooController],
})
export class VooModule {}