import { Cliente } from "src/models/cliente.model";
import { tipoConta } from "src/enums/tipo-contas-enum";
import { v4 as uuidv4 } from "uuid";

export class ContaBancaria {
    tipo: tipoConta;
    numeroConta: number;
    saldo: number;
    idCliente: string;
    rendaMensal: number;
    idConta: string;

    constructor(tipo: tipoConta, numeroConta: number, saldo: number, idCliente: string, rendaMensal: number) {
        this.idConta = uuidv4();
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
        titularConta: Cliente,
        rendaMensal: number,
        numeroConta: number = ContaCorrente.gerarNumeroConta() // Default value
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
        titularConta: Cliente,
        rendaMensal: number,
        numeroConta: number = ContaPoupanca.gerarNumeroConta() // Default value
    ) {
        super(tipoConta.poupanca, numeroConta, saldo, titularConta.id, rendaMensal);
    }

    static gerarNumeroConta(): number {
        return Math.floor(Math.random() * 100000);
    }
}
