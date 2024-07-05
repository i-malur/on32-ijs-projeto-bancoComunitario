import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.model';
import { ContaCorrente, ContaPoupanca, ContaBancaria } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('criar/usuario')
  criarCliente(
    @Body('nomeCompleto') nomeCompleto: string,
    @Body('endereco') endereco: string,
    @Body('telefone') telefone: string,
    @Body('rendaMensal') rendaMensal: number,
    @Body('gerente') gerente: Gerente
  ): Cliente {
    return this.clienteService.criarCliente(nomeCompleto, endereco, telefone, rendaMensal, gerente);
  }

  @Post(':id/conta-corrente')
  criarContaCorrente(@Param('id') clienteId: string): ContaCorrente {
    return this.clienteService.criarContaCor(clienteId);
  }

  @Post(':id/conta-poupanca')
  criarContaPoupanca(@Param('id') clienteId: string): ContaPoupanca {
    return this.clienteService.criarContaPop(clienteId);
  }

  @Get(':id/contas')
  obterContasCliente(@Param('id') clienteId: string): ContaBancaria[] {
    const cliente = this.clienteService.obterClienteID(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente.contas;
  }

  @Get('todos-os-clientes')
  obterClientes(): Cliente[] {
    return this.clienteService.obterClientes();
  }

  @Get('contas')
  listarTodasContas(): ContaBancaria[] {
    return this.clienteService.listarTodasContas();
  }

  @Delete(':clienteId/contas/:idConta')
  excluirConta(
    @Param('clienteId') clienteId: string,
    @Param('idConta') idConta: string
  ): void {
    return this.clienteService.excluirConta(clienteId, idConta);
  }

  @Patch(':clienteId/contas/:idConta')
  mudarTipoConta(
    @Param('clienteId') clienteId: string,
    @Param('idConta') idConta: string,
    @Body('novoTipo') novoTipo: string
  ): ContaBancaria {
    return this.clienteService.mudarTipoConta(clienteId, idConta, novoTipo);
  }

  @Delete(':id')
  excluirCliente(@Param('id') id: string): void {
    this.clienteService.excluirUsuarios(id);
  }
}
