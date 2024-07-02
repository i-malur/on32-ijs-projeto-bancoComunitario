import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClienteService } from './cliente/cliente.service';
import { ClienteController } from './cliente/cliente.controller';
import { ContaService } from './conta/conta.service';
import { ContaController } from './conta/conta.controller';
import { GerenteService } from './gerente/gerente.service';
import { GerenteController } from './gerente/gerente.controller';

@Module({
  imports: [],
  controllers: [AppController, ClienteController, ContaController, GerenteController],
  providers: [AppService, ClienteService, ContaService, GerenteService],
})
export class AppModule {}
