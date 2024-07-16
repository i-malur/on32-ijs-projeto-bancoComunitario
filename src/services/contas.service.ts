import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ContaBancaria, ContaCorrente } from 'src/models/contas.model';
import { tipoConta } from 'src/enums/tipo-contas-enum';
import { ClienteService } from 'src/services/cliente.service'; // Verifique se o caminho para o serviço do cliente está correto

@Injectable()
export class ContasService {
  private readonly logger = new Logger(ContasService.name);

  constructor(private readonly clienteService: ClienteService) {}

  async depositar(numeroConta: number, valor: number): Promise<string> {
    const conta: ContaBancaria = this.clienteService.obterContaPorNumero(numeroConta);
    if (!conta) {
      throw new Error('Conta não encontrada.');
    }
    conta.saldo += valor;
    return `Olá, ${conta.idCliente}! Seu saldo atual após depósito é de R$${conta.saldo.toFixed(2)}`;
  }

  async sacar(conta: ContaBancaria, valor: number): Promise<string> {
    if (conta.tipo === tipoConta.corrente) {
      const contaCorrente = conta as ContaCorrente;
      if ((conta.saldo + contaCorrente.ChequeEspecial) >= valor) {
        conta.saldo -= valor;
        return `Saque de R$${valor.toFixed(2)} realizado com sucesso. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
      } else {
        return 'Saldo insuficiente.';
      }
    } else if (conta.tipo === tipoConta.poupanca && conta.saldo >= valor) {
      conta.saldo -= valor;
      return `Saque de R$${valor.toFixed(2)} realizado com sucesso. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
    } else {
      return 'Saldo insuficiente.';
    }
  }

  async transferir(contaOrigem: ContaBancaria, contaDestino: ContaBancaria, valor: number): Promise<string>{
    if (contaOrigem.tipo === tipoConta.corrente) {
      const contaCorrenteOrigem = contaOrigem as ContaCorrente;
      if ((contaOrigem.saldo + contaCorrenteOrigem.ChequeEspecial) >= valor) {
        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;
        return `Transferência de R$${valor.toFixed(2)} realizada com sucesso. Saldo atual da conta de origem: R$${contaOrigem.saldo.toFixed(2)}, saldo atual da conta de destino: R$${contaDestino.saldo.toFixed(2)}.`;
      } else {
        return 'Transferência não realizada. Saldo insuficiente.';
      }
    } else if (contaOrigem.tipo === tipoConta.poupanca && contaOrigem.saldo >= valor) {
      contaOrigem.saldo -= valor;
      contaDestino.saldo += valor;
      return `Transferência de R$${valor.toFixed(2)} realizada com sucesso. Saldo atual da conta de origem: R$${contaOrigem.saldo.toFixed(2)}, saldo atual da conta de destino: R$${contaDestino.saldo.toFixed(2)}.`;
    } else {
      return 'Transferência não realizada. Saldo insuficiente.';
    }
  }

  // pagamentos (pix e boleto)
  async realizarPagamento(numeroConta: number, valor: number, tipoPagamento: 'PIX' | 'BOLETO'): Promise<string> {
    const conta: ContaBancaria = this.clienteService.obterContaPorNumero(numeroConta);
    if (!conta) {
      this.logger.error(`Conta não encontrada: ${numeroConta}`);
      throw new NotFoundException('Conta não encontrada.');
    }

    if (conta.saldo >= valor) {
      conta.saldo -= valor;
      this.logger.log(`Pagamento realizado com sucesso. Conta: ${numeroConta}, Valor: ${valor}`);
      return `Pagamento de R$${valor.toFixed(2)} realizado com sucesso via ${tipoPagamento}. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
    } else if (conta instanceof ContaCorrente && conta.ChequeEspecial >= valor - conta.saldo) {
      conta.saldo -= valor;
      this.logger.log(`Pagamento realizado com uso do cheque especial. Conta: ${numeroConta}, Valor: ${valor}`);
      return `Pagamento de R$${valor.toFixed(2)} realizado com sucesso via ${tipoPagamento} utilizando cheque especial. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
    } else {
      this.logger.error(`Saldo insuficiente para realizar o pagamento. Conta: ${numeroConta}, Valor: ${valor}`);
      throw new BadRequestException('Saldo insuficiente para realizar o pagamento.');
    }
  }
}
