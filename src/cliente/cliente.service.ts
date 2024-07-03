import { Injectable } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ContaBancaria } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';

@Injectable()
export class ClienteService {
    private clientesBanco: Cliente[] = [];
    
    CriarCliente(
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

    getAllClientes(): Cliente[] {
        return this.clientesBanco;
    }

    getCliente(id: string): Cliente {
        return this.clientesBanco.find(cliente => cliente.id === id);
    }

    verificarSaldo(clienteId: string, numeroConta: number): number {
        const cliente = this.getCliente(clienteId);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }

        const conta = cliente.contas.find(conta => conta.numeroConta === numeroConta);
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        return conta.saldo;
    }

    trocarTipoDeConta(clienteId: string, novaConta: ContaBancaria): string {
        const cliente = this.getCliente(clienteId);
        if (!cliente) {
            throw new Error('Cliente não encontrado');
        }

        cliente.contas.push(novaConta);
        return `Tipo de conta trocado com sucesso. Novo tipo de conta: ${novaConta.tipo}`;
    }
}