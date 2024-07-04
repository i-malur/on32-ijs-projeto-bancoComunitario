import { Controller, Delete, Patch, Param, Body, HttpStatus, HttpException, Post, Get } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get('lista/clientes')
  getAllClientes(): Cliente[] {
    return this.clienteService.obterClientes();
  }

  @Get(':id')
  getCliente(@Param('id') id: string): Cliente {
    return this.clienteService.obterClienteID(id);
  }

  @Post('criar/usuario')
  criarCliente(
    @Body() body: { nomeCompleto: string, endereco: string, telefone: string, rendaMensal: number, gerente: Gerente, contas: ContaBancaria[] }
  ): Cliente {
    return this.clienteService.criarCliente(body.nomeCompleto, body.endereco, body.telefone, body.rendaMensal, body.gerente, body.contas);
  }

  @Post('criar/corrente')
  criarContaCorrente(@Body() body: { clienteId: string }): ContaCorrente | string {
    try {
      const contaCorrente = this.clienteService.criarContaCor(body.clienteId);
      return contaCorrente;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('criar/poupanca')
  criarContaPoupanca(@Body() body: { clienteId: string }): ContaPoupanca {
    const cliente = this.clienteService.obterClienteID(body.clienteId);
    if (!cliente) {
      throw new HttpException('Cliente não encontrado', HttpStatus.BAD_REQUEST);
    }
    return this.clienteService.criarContaPop(cliente);
  }

  @Delete(':clienteId/contas/:contaId')
  excluirConta(@Param('clienteId') clienteId: string, @Param('contaId') contaId: string): void {
    try {
      this.clienteService.excluirConta(clienteId, contaId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':clienteId/contas/:contaId/mudar-tipo')
  mudarTipoConta(
    @Param('clienteId') clienteId: string,
    @Param('contaId') contaId: string,
    @Body() body: { novoTipo: string },
  ): ContaBancaria {
    try {
      const novoTipoConta = this.clienteService.mudarTipoConta(clienteId, contaId, body.novoTipo);
      return novoTipoConta;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
