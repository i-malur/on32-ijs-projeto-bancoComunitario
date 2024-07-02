import { Contas } from 'src/conta/conta.model';
import { v4 as uuidv4 } from 'uuid';
import { Gerente } from 'src/gerente/gerente.model';

export class Cliente{
    id: string;
    nomeCompleto: string;
    telefone: string;
    endereco: string;
    contas: Contas[];
    gerente: Gerente

    constructor(nomeCompleto: string, telefone: string, endereco: string){
        this.id = uuidv4()
        this.nomeCompleto = nomeCompleto
        this.telefone = telefone
        this.endereco = endereco
        this.contas = []
        this.gerente = new Gerente()
    }

    abrirConta(conta: Contas): void{
        this.contas.push(conta);
    }

    fecharConta(conta: Contas): void{
        this.contas = this.contas.filter(item => item !== conta)
    }

    MudarTipoConta(conta: Contas, tipo: 'CORRENTE' | 'POUPANCA'):void{
        conta.tipo = tipo;
    }
}