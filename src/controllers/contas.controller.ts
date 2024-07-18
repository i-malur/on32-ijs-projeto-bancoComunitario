import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { ContasService } from 'src/services/contas.service';
import { ContaBancaria } from 'src/models/contas.model';
import { ClienteService } from 'src/services/cliente.service';

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
  async transferir(@Body() body: { contaOrigemNumero: number, contaDestinoNumero: number, valor: number }): Promise<string> {
    const { contaOrigemNumero, contaDestinoNumero, valor } = body;

    const contaOrigem = this.clienteService.obterContaPorNumero(contaOrigemNumero);
    const contaDestino = this.clienteService.obterContaPorNumero(contaDestinoNumero);

    if (!contaOrigem || !contaDestino) {
      throw new BadRequestException('Conta de origem ou destino não encontrada');
    }

    try {
      const mensagem = await this.contasService.transferir(contaOrigem, contaDestino, valor);
      return mensagem;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('pagamento')
  async realizarPagamento(
    @Body('numeroConta') numeroConta: number,
    @Body('valor') valor: number,
    @Body('tipoPagamento') tipoPagamento: 'PIX' | 'BOLETO'
  ): Promise<string> {
    return this.contasService.realizarPagamento(numeroConta, valor, tipoPagamento);
  }
}
