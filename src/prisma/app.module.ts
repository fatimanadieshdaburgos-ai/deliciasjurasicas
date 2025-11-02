import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ClientesController } from 'src/clientes/clientes.controller';

@Module({
  imports:[ClientesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
