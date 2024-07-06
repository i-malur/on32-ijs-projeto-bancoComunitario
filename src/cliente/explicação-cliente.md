# CLIENTE.SERVICE
O arquivo possui métodos que permite:
1. Criação de um novo usuário;
2. Excluir um usuário;
3. Criação de conta corrente;
4. Criação de conta poupança;
5. Obter uma conta a partir de seu número;
6. Lista de todas as contas;
7. Lista de todos os usuários;
8. Lista usuário específico;
9. Excluir uma conta de usuário;
10. Mudar o tipo de conta.


# CLIENTE.CONTROLLER
As rotas estão separadas em:
1. Rota de criação de usuário;
2. Rota para a exclusão de usuário;
3. Rota para criar conta corrente;
4. Rota para criar conta poupança;
5. Rota para listar conta específica;
6. Rota para listar todas as contas;
7. Rota para listar clientes;
8. Rota para listar cliente específico;
9. Rota para excluir conta;
10. Rota para mudar tipo de conta.

# CLIENTE.MODEL
Arquivo de classe modelo para o desenvolvimento de código.
```typescript
export class Cliente {

    //propriedades da classe
    public id: string;
    public nomeCompleto: string;
    public endereco: string;
    public telefone: string;
    public contas: ContaBancaria[];
    public gerente: Gerente;
    public rendaMensal: number;

    //chamada na criação do objeto
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
```