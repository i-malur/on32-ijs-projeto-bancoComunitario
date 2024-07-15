import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Cliente } from 'src/models/cliente.model';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/models/contas.model';
import { Gerente } from 'src/models/gerente.model';
import { GerenteService } from 'src/services/gerente.service';

@Controller('administrador')
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) {}


  //Criar cliente
  @Post('gerente/criar/cliente')
  criarCliente
  (@Body() body: { nomeCompleto: string, 
    endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cep: string;
    estado: string;
  }, telefone: string, rendaMensal: number, contas: ContaBancaria[], gerente: Gerente }): Cliente {
    return this.gerenteService.criarClienteGerente(body.nomeCompleto, body.endereco, body.telefone, body.rendaMensal, body.gerente, body.contas); 
  }

  @Get('gerente/clientes')
  obterTodosClientes(): Cliente[] {
    return this.gerenteService.obterClientesGerente();
  }

  //listar cliente específico
  @Get('gerente/cliente/:clienteId')
  obterClientePorID(@Param('clienteId') clienteId: string): Cliente {
    try {
      return this.gerenteService.obterClienteIdGerente(clienteId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  //deletar cliente
  @Delete('gerente/excluir/cliente/:clienteId')
  excluirCliente(@Param('clienteId') clienteId: string): void {
    try {
      this.gerenteService.excluirClienteGerente(clienteId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //criar conta corrente
  @Post('gerente/criar/corrente')
  criarContaCorrente(@Body() body: { clienteId: string }): ContaCorrente {
      try {
          const contaCorrente = this.gerenteService.gerenteCriarContaCor(body.clienteId); 
          return contaCorrente;
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }

  //criar conta poupança
  @Post('gerente/criar/poupanca')
  criarContaPoupanca(@Body() body: { clienteId: string }): ContaPoupanca {
      try {
          const contaPoupanca = this.gerenteService.gerenteCriarContaPop(body.clienteId);
          return contaPoupanca;
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }

  //deletar conta
  @Delete('gerente/excluir/conta/:clienteId/:idConta')
  excluirConta(
    @Param('clienteId') clienteId: string,
    @Param('idConta') idConta: string
  ): void {
    try {
      this.gerenteService.gerenteExcluirConta(clienteId, idConta);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // alterar tipo de conta
  @Patch(':clienteId/contas/:contaId/mudar-tipo')
  mudarTipoConta(
    @Param('clienteId') clienteId: string,
    @Param('contaId') contaId: string,
    @Body() body: { novoTipo: string },
  ): ContaBancaria {
    try {
      const novoTipoConta = this.gerenteService.gerrenteMudarTipoConta(clienteId, contaId, body.novoTipo);
      return novoTipoConta;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}
