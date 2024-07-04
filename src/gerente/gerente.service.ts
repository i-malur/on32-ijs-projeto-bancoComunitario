import { Injectable } from '@nestjs/common';
import { Cliente } from 'src/cliente/cliente.model';
import { ClienteService } from 'src/cliente/cliente.service';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/contas/contas.model';
import { Gerente } from './gerente.model';

@Injectable()
export class GerenteService {
    
    private clientes: Cliente[] = [];
    constructor(private readonly clienteService: ClienteService){}

    // criar um cliente
    CriarCliente(nomeCompleto: string, 
        endereco: string, 
        telefone: string, 
        rendaMensal: number, 
        gerente: Gerente, 
        contas: ContaBancaria[] = []
        ): Cliente {
            const novoCliente = new Cliente(nomeCompleto, endereco, telefone, rendaMensal, gerente, contas);
            this.clientes.push(novoCliente);
            return novoCliente;
        };
    
    obterClientes(): Cliente[] {
        return this.clientes;
    }
            
    obterClienteID(id: string): Cliente {
        return this.clientes.find(cliente => cliente.id === id);
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

    // criar conta poupança 
    criarContaPop(cliente: Cliente): ContaPoupanca {
        console.log(`Olá, ${cliente.nomeCompleto}! Sua conta poupança foi criada com sucesso!`);
        return new ContaPoupanca(0, cliente, cliente.rendaMensal);
    }
        
    // excluir conta
    excluirConta(clienteId: string, contaId: string): void {
        const cliente = this.obterClienteID(clienteId);
        if (!cliente) {
          throw new Error('Cliente não encontrado');
        }
        cliente.contas = cliente.contas.filter(conta => conta.idConta !== contaId);
    }

    // alterar tipo de conta
    mudarTipoConta(clienteId: string, contaId: string, novoTipo: string): ContaBancaria {
        const cliente = this.obterClienteID(clienteId);
        if (!cliente) {
        throw new Error('Cliente não encontrado');
        }   
        const conta = cliente.contas.find(conta => conta.idConta === contaId);
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
        cliente.contas = cliente.contas.map(contaNova => contaNova.idConta === contaId ? contaAlterada : contaNova);
        return contaAlterada;
  }
    
}
