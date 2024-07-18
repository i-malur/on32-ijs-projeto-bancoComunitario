import { Cliente } from "src/models/cliente.model";
import { v4 as uuidv4 } from "uuid";

export class Gerente{
    public idGerente: string;
    public nomeGerente: string;
    public clientes: Cliente[];

    constructor(
        nomeGerente: string,
        clientes: Cliente[]
    ){
        this.idGerente = uuidv4();
        this.nomeGerente = nomeGerente;
        this.clientes = clientes;

    }
}