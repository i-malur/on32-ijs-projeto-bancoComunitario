import { Cliente } from "src/cliente/cliente.model";

export class Contas{
    saldo: number;
    cliente: Cliente;
    tipo: 'CORRENTE' | 'POUPANCA'

    constructor(cliente: Cliente, tipo: 'POUPANCA' | 'CORRENTE'){
        this.cliente = cliente;
        this.tipo = tipo;
    }
}