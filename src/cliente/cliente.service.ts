import { Injectable } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';

@Injectable()
export class ClienteService {
  private clientesBanco: Cliente[] = [];

  // criar usuário
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

  //excluir usuário
  excluirUsuarios(clienteId: string): void {
    const index = this.clientesBanco.findIndex(cliente => cliente.id === clienteId);
    if (index === -1) {
      throw new Error('Cliente não encontrado');
    }

    this.clientesBanco.splice(index, 1);
    console.log('Cliente excluído com sucesso.');
  }

  //criar conta corrente
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

  //criar conta poupança
  criarContaPop(clienteId: string): ContaPoupanca {
    const cliente = this.obterClienteID(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    
    const numeroConta = ContaPoupanca.gerarNumeroConta();
    const contaPoupanca = new ContaPoupanca(0, cliente, cliente.rendaMensal, numeroConta);
    cliente.contas.push(contaPoupanca);
    return contaPoupanca;
  }

  //pegar conta por número
  obterContaPorNumero(numeroConta: number): ContaBancaria | null {
    for (const cliente of this.clientesBanco) {
      const conta = cliente.contas.find(conta => conta.numeroConta === numeroConta);
      if (conta) {
        return conta;
      }
    }
    return null;
  }

  //listar todas as contas
  listarTodasContas(): ContaBancaria[] {
    const todasContas: ContaBancaria[] = [];
    for (const cliente of this.clientesBanco) {
      todasContas.push(...cliente.contas);
    }
    return todasContas;
  }

  //lista de usuários
  obterClientes(): Cliente[] {
    return this.clientesBanco;
  }

  //usuário específico
  obterClienteID(id: string): Cliente {
    return this.clientesBanco.find(cliente => cliente.id === id);
  }

  //excluir conta
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

  //mudar tipo de conta
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
