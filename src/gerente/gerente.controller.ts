import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Cliente } from 'src/cliente/cliente.model';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/contas/contas.model';
import { Gerente } from './gerente.model';
import { GerenteService } from './gerente.service';

@Controller('gerente')
export class GerenteController {
  constructor(private readonly gerenteService: GerenteService) {}


  @Post('gerente/criar/cliente')
  criarCliente(@Body() body: { nomeCompleto: string, endereco: string, telefone: string, rendaMensal: number, contas: ContaBancaria[], gerente: Gerente }): Cliente {
    return this.gerenteService.CriarCliente(body.nomeCompleto, body.endereco, body.telefone, body.rendaMensal, body.gerente, body.contas); 
  }

  @Post('gerente/criar/corrente')
  criarContaCorrente(@Body() body: { clienteId: string }): ContaCorrente | string {
      try {
          const contaCorrente = this.gerenteService.criarContaCor(body.clienteId); 
          return contaCorrente;
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }

  @Post('gerente/criar/poupanca')
  criarContaPoupanca(@Body() body: {cliente: Cliente }): ContaPoupanca {
      return this.gerenteService.criarContaPop(body.cliente);
  }

  @Delete('gerente/excluir/conta/:clienteId/:contaId')
  excluirConta(@Param('clienteId') clienteId: string, @Param('contaId') contaId: string): void {
    try {
      this.gerenteService.excluirConta(clienteId, contaId);
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
       const novoTipoConta = this.gerenteService.mudarTipoConta(clienteId, contaId, body.novoTipo);
       return novoTipoConta;
     } catch (error) {
       throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
     }
   }



}
