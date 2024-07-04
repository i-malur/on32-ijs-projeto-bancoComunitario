import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ContasService } from './contas.service';
import { ContaBancaria } from './contas.model';
import { ClienteService } from 'src/cliente/cliente.service';

@Controller('contas')
export class ContasController {
  constructor(
    private readonly contasService: ContasService,
    private readonly clienteService: ClienteService 
  ) {}

  @Post('depositar')
  async depositar(@Body() body: { numeroConta: number, valor: number }): Promise<string> {
    const { numeroConta, valor } = body;

    try {
      const mensagem = await this.contasService.depositar(numeroConta, valor);
      return mensagem;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  
  @Post('sacar') 
  async sacar(@Body() body: { numeroConta: number, valor: number }): Promise<string> {
    const { numeroConta, valor } = body;
    const conta: ContaBancaria | null = this.clienteService.obterContaPorNumero(numeroConta);
    if (!conta) {
      throw new BadRequestException('Conta não encontrada.');
    }

    try {
      const mensagem = await this.contasService.sacar(conta, valor);
      return mensagem;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('transferir')
  async transferir(@Body() body: { contaOrigem: ContaBancaria, contaDestino: ContaBancaria, valor: number }): Promise<string> {
    const { contaOrigem, contaDestino, valor } = body;

    try {
      const mensagem = await this.contasService.transferir(contaOrigem, contaDestino, valor);
      return mensagem;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
