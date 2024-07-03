import { Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Body } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ContaBancaria } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';
import { ClienteService } from './cliente.service';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('criar/conta')
  criarCliente(
    @Body() body: { nomeCompleto: string, endereco: string, telefone: string, rendaMensal: number, contas: ContaBancaria[], gerente: Gerente }
  ): Cliente {
    return this.clienteService.CriarCliente(body.nomeCompleto, body.endereco, body.telefone, body.rendaMensal, body.gerente, body.contas);
  }

  @Get()
  getAllClientes(): Cliente[] {
    return this.clienteService.getAllClientes();
  }

  @Get(':id')
  getCliente(@Param('id') id: string): Cliente {
    return this.clienteService.getCliente(id);
  }

  @Patch('edit/cliente')
  editarCliente(
    @Param('id') id: string,
    @Query() updates: Partial<Cliente>
  ): any {
    const informacoesCliente = this.clienteService.editarCliente(id, updates);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cliente editado com sucesso',
      data: informacoesCliente,
    };
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): void {
    this.clienteService.deleteClienteById(id);
  }
}
