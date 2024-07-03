import { Cliente } from "src/cliente/cliente.model";

export class Gerente{
    protected nomeCompleto: string;
    protected idGerente: string;
    protected clientes: Cliente[]
}