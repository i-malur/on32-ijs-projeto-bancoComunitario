import { Cliente } from "src/cliente/cliente.model";
import { tipoConta } from "./tipo-contas-enum";

export class ContaBancaria {
    tipo: tipoConta;
    numeroConta: number;
    saldo: number = 0;
    idCliente: string;
    rendaMensal: number;

    constructor(tipo: tipoConta, numeroConta: number, saldo: number, idCliente: string, rendaMensal: number) {
        this.tipo = tipo;
        this.numeroConta = numeroConta;
        this.saldo = saldo;
        this.idCliente = idCliente;
        this.rendaMensal = rendaMensal;
    }
}

export class ContaCorrente extends ContaBancaria {
    tipoDeConta: tipoConta = tipoConta.corrente;
    ChequeEspecial: number = 100;

    constructor(
        saldo: number,
        numeroConta: number,
        titularConta: Cliente,
        rendaMensal: number,
    ) {
        super(tipoConta.corrente, numeroConta, saldo, titularConta.id, rendaMensal);
    }

    static gerarNumeroConta(): number {
        return Math.floor(Math.random() * 100000);
    }
}

export class ContaPoupanca extends ContaBancaria {
    tipoDeConta: tipoConta = tipoConta.poupanca;

    constructor(
        saldo: number,
        numeroConta: number,
        titularConta: Cliente,
        rendaMensal: number,
    ) {
        super(tipoConta.poupanca, numeroConta, saldo, titularConta.id, rendaMensal);
    }

    static gerarNumeroConta(): number {
        return Math.floor(Math.random() * 100000);
    }
}
