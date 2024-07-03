import { ContaBancaria } from "src/contas/contas.model";
import { Gerente } from "src/gerente/gerente.model";
import { v4 as uuidv4 } from "uuid";

export class Cliente {
    public id: string;
    public nomeCompleto: string;
    public endereco: string;
    public telefone: string;
    public contas: ContaBancaria[];
    public gerente: Gerente;
    public rendaMensal: number;

    constructor(
        nomeCompleto: string,
        endereco: string,
        telefone: string,
        rendaMensal: number,
        gerente: Gerente,
        contas: ContaBancaria[] = [],
    ) {
        this.id = uuidv4();
        this.nomeCompleto = nomeCompleto;
        this.endereco = endereco;
        this.telefone = telefone;
        this.contas = contas;
        this.gerente = gerente;
        this.rendaMensal = rendaMensal;
    }
}
