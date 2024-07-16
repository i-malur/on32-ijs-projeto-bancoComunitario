import { Injectable } from '@nestjs/common';
import { Cliente } from 'src/models/cliente.model';
import { ClienteService } from 'src/services/cliente.service';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from 'src/models/contas.model';
import { Gerente } from 'src/models/gerente.model';

@Injectable()
export class GerenteService {
    
    private clientes: Cliente[] = [];
    
    constructor(private readonly clienteService: ClienteService){}

    // criar um cliente
    criarClienteGerente(nomeCompleto: string, 
        endereco: {
            rua: string;
            numero: string;
            bairro: string;
            cep: string;
            estado: string;
        },  
        telefone: string, 
        rendaMensal: number, 
        gerente: Gerente, 
        contas: ContaBancaria[] = []
        ): Cliente {
            const novoCliente = new Cliente(nomeCompleto, endereco, telefone, rendaMensal, gerente, contas);
            this.clientes.push(novoCliente);
            return novoCliente;
        };
    
    //Listar todos os clientes
    obterClientesGerente(): Cliente[] {
        return this.clientes;
    }
    
    //Listar cliente específico
    obterClienteIdGerente(id: string): Cliente {
        return this.clientes.find(cliente => cliente.id === id);
    }

    //excluir cliente
    excluirClienteGerente(id: string): void {
        const index = this.clientes.findIndex(cliente => cliente.id === id);
        if (index === -1) {
            throw new Error('Cliente não encontrado');
        }
        this.clientes.splice(index, 1);
    }

    //criar conta corrente
    gerenteCriarContaCor(clienteId: string): ContaCorrente | null {
        const cliente = this.obterClienteIdGerente(clienteId);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        const contaCorrenteExistente = cliente.contas.find(conta => conta instanceof ContaCorrente);
        if (contaCorrenteExistente) {
            throw new Error('Cliente já possui uma conta corrente');
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
    gerenteCriarContaPop(clienteId: string): ContaPoupanca {
        const cliente = this.obterClienteIdGerente(clienteId);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }
        const contaPoupancaExistente = cliente.contas.find(conta => conta instanceof ContaPoupanca);
        if (contaPoupancaExistente) {
            throw new Error('Cliente já possui uma conta poupança');
        }

        console.log(`Olá, ${cliente.nomeCompleto}! Sua conta poupança foi criada com sucesso!`);
        const numeroContaPoupanca = ContaPoupanca.gerarNumeroConta();
        const novaContaPoupanca = new ContaPoupanca(0, cliente, cliente.rendaMensal, numeroContaPoupanca);
        cliente.contas.push(novaContaPoupanca);
        return novaContaPoupanca;
    }
        
    // excluir conta
    gerenteExcluirConta(clienteId: string, contaId: string): void {
        const cliente = this.obterClienteIdGerente(clienteId);
        if (!cliente) {
          throw new Error('Cliente não encontrado');
        }
        cliente.contas = cliente.contas.filter(conta => conta.idConta !== contaId);
    }

    // alterar tipo de conta
    gerrenteMudarTipoConta(clienteId: string, contaId: string, novoTipo: string): ContaBancaria {
        const cliente = this.obterClienteIdGerente(clienteId);
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
