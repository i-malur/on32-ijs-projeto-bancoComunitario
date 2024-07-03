import { Injectable } from '@nestjs/common';
import { Cliente } from 'src/cliente/cliente.model';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from './contas.model';
import { tipoConta } from './tipo-contas-enum';

@Injectable()
export class ContasService {
  criarContaCor(cliente: Cliente): ContaCorrente | null {
    if (cliente.rendaMensal >= 500) {
      console.log('Olá, Sua conta corrente foi criada com sucesso!');
      const numeroConta = ContaCorrente.gerarNumeroConta()
      return new ContaCorrente(0, numeroConta, cliente, cliente.rendaMensal);
    } else {
      console.log('A renda salarial informada é insuficiente para abrir uma conta corrente.');
        return null;
      }
    }
    
    criarContaPop(cliente: Cliente): ContaPoupanca {
      console.log(`Olá, ${cliente.nomeCompleto}! Sua conta poupança foi criada com sucesso!`);
      const numeroConta = ContaPoupanca.gerarNumeroConta()
      return new ContaPoupanca(0, numeroConta, cliente, cliente.rendaMensal);
    }
    
    depositar(conta: ContaBancaria, valor: number): string {
      conta.saldo += valor;
      return `Olá, ${conta.idCliente}! Seu saldo atual após depósito é de R$${conta.saldo.toFixed(2)}`;
    }
    
    sacar(conta: ContaBancaria, valor: number): string {
      if (conta.tipo === tipoConta.corrente && (conta.saldo + (conta as ContaCorrente).ChequeEspecial) >= valor) {
        conta.saldo -= valor;
        return `Saque de R$${valor.toFixed(2)} realizado com sucesso. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
      } 
      else if (conta.tipo === tipoConta.poupanca && conta.saldo >= valor) {
        conta.saldo -= valor;
        return `Saque de R$${valor.toFixed(2)} realizado com sucesso. Saldo atual: R$${conta.saldo.toFixed(2)}.`;
      } 
      else {
        return 'Saldo insuficiente.';
      }
      }
    
      transferir(contaOrigem: ContaBancaria, contaDestino: ContaBancaria, valor: number): string {
        if (contaOrigem.tipo === tipoConta.corrente) {
          const contaCorrenteOrigem = contaOrigem as ContaCorrente;
          if ((contaOrigem.saldo + contaCorrenteOrigem.ChequeEspecial) >= valor) {
            contaOrigem.saldo -= valor;
            contaDestino.saldo += valor;
            return `Transferência de R$${valor.toFixed(2)} realizada com sucesso. Saldo atual da conta de origem: R$${contaOrigem.saldo.toFixed(2)}, saldo atual da conta de destino: R$${contaDestino.saldo.toFixed(2)}.`;
          } else {
            return `Transferência não realizada. Saldo insuficiente.`;
          }
        } else if (contaOrigem.tipo === tipoConta.poupanca && contaOrigem.saldo >= valor) {
          contaOrigem.saldo -= valor;
          contaDestino.saldo += valor;
          return `Transferência de R$${valor.toFixed(2)} realizada com sucesso. Saldo atual da conta de origem: R$${contaOrigem.saldo.toFixed(2)}, saldo atual da conta de destino: R$${contaDestino.saldo.toFixed(2)}.`;
        } else {
          return `Transferência não realizada. Saldo insuficiente.`;
        }
      }
      
}
