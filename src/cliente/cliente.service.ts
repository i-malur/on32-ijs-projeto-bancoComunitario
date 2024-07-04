import { Injectable } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClienteService {
  private clientesBanco: Cliente[] = [];

  criarCliente(
    nomeCompleto: string,
    endereco: string,
    telefone: string,
    rendaMensal: number,
    gerente: Gerente,
    contas: ContaBancaria[] = [] 
  ): Cliente {
    const novoCliente = new Cliente(nomeCompleto, endereco, telefone, rendaMensal, gerente, contas);
    this.clientesBanco.push(novoCliente);
    return novoCliente;
  }

  criarContaCor(clienteId: string): ContaCorrente | null {
    const cliente = this.obterClienteID(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    if (cliente.rendaMensal >= 500) {
      const numeroConta = ContaCorrente.gerarNumeroConta();
      const contaCorrente = new ContaCorrente(0, cliente, cliente.rendaMensal, numeroConta);
      cliente.contas.push(contaCorrente);
      return contaCorrente;
    } else {
      throw new Error('Renda insuficiente para criar conta corrente');
    }
  }

  criarContaPop(cliente: Cliente): ContaPoupanca {
    console.log(`Olá, ${cliente.nomeCompleto}! Sua conta poupança foi criada com sucesso!`);
    return new ContaPoupanca(0, cliente, cliente.rendaMensal);
  }

  obterContaPorNumero(numeroConta: number): ContaBancaria | null {
    for (const cliente of this.clientesBanco) {
      const conta = cliente.contas.find(conta => conta.numeroConta === numeroConta);
      if (conta) {
        return conta;
      }
    }
    return null;
  }

  obterClientes(): Cliente[] {
    return this.clientesBanco;
  }

  obterClienteID(id: string): Cliente | undefined {
    return this.clientesBanco.find(cliente => cliente.id === id);
  }

  excluirConta(clienteId: string, idConta: string): void {
    const cliente = this.obterClienteID(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const index = cliente.contas.findIndex(conta => conta.idConta === idConta);
    if (index === -1) {
      throw new Error('Conta não encontrada para este cliente');
    }

    cliente.contas.splice(index, 1);
    console.log('Conta excluída com sucesso.');
  }

  mudarTipoConta(clienteId: string, idConta: string, novoTipo: string): ContaBancaria {
    const cliente = this.obterClienteID(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const conta = cliente.contas.find(conta => conta.idConta === idConta);
    if (!conta) {
      throw new Error('Conta não encontrada para este cliente');
    }

    let contaAlterada: ContaBancaria;
    if (novoTipo === 'corrente') {
      contaAlterada = new ContaCorrente(conta.saldo, cliente, cliente.rendaMensal, conta.numeroConta);
    } else if (novoTipo === 'poupanca') {
      contaAlterada = new ContaPoupanca(conta.saldo, cliente, cliente.rendaMensal);
    } else {
      throw new Error('Tipo de conta inválido. Use "corrente" ou "poupanca".');
    }

    cliente.contas = cliente.contas.map(contaNova => contaNova.idConta === idConta ? contaAlterada : contaNova);
    return contaAlterada;
  }
}
