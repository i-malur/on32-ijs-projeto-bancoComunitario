import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteService } from './services/cliente.service';
import { ClienteController } from './controllers/cliente.controller';
import { GerenteService } from './services/gerente.service';
import { GerenteController } from './controllers/gerente.controller';
import { ContasService } from './services/contas.service';
import { ContasController } from './controllers/contas.controller';

@Module({
  imports: [],
  controllers: [AppController, ClienteController, GerenteController, ContasController],
  providers: [AppService, ClienteService, GerenteService, ContasService],
})
export class AppModule {}
