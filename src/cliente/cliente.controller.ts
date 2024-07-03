import { Injectable } from '@nestjs/common';
import { Cliente } from './cliente.model';
import { ContaBancaria } from 'src/contas/contas.model';
import { Gerente } from 'src/gerente/gerente.model';

@Injectable()
export class ClienteService {
  private clientesBanco: Cliente[] = [];
    
  CriarCliente(nomeCompleto: string, endereco: string, telefone: string, rendaMensal: number, contas: ContaBancaria[], gerente: Gerente,): Cliente {
    const novoCliente = new Cliente(nomeCompleto, endereco, telefone, rendaMensal, gerente, contas);
    this.clientesBanco.push(novoCliente);
    return novoCliente;
  }

  getAllClientes(): Cliente[] {
    return this.clientesBanco;
  }

  getCliente(id: string): Cliente {
    return this.clientesBanco.find(IDcliente => IDcliente.id === id);
  }

  verificarSaldo(clienteId: string): number {
    const cliente = this.getCliente(clienteId);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    return cliente.contas.reduce((saldoTotal, conta) => saldoTotal + conta.saldo, 0);
  }
}
