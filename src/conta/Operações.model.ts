import { Contas } from "./conta.model"
import { Cliente } from "src/cliente/cliente.model";

export class Banco implements Contas{
    contas: Contas[] = []
    saldo: number;
    cliente: Cliente;
    tipo: 'CORRENTE' | 'POUPANCA';

    constructor(saldo: number, cliente: Cliente, tipo: 'CORRENTE' | 'POUPANCA'){
        this.saldo = saldo;
        this.cliente = cliente;
        this.tipo = tipo;

    }

    depositar(valor: number): string{
        this.saldo += valor
        return 'Valor depositado com sucesso!'
    }

    sacar(valor: number): void{
        if (valor > this.saldo){
            throw new Error('Saldo insuficiente!') 
        }else{
            this.saldo -= valor
        }
    }
    
    verificarSaldo(): number{
        return this.saldo
    }
}