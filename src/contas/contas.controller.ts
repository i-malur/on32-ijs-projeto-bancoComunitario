import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ContasService } from './contas.service';
import { ContaBancaria, ContaCorrente, ContaPoupanca } from './contas.model';
import { Cliente } from 'src/cliente/cliente.model';


@Controller('contas')
export class ContasController {
    constructor(private readonly contasService: ContasService) {}

    @Post('criar/corrente')
    criarContaCorrente(@Body() body: { cliente: Cliente }): ContaCorrente | string {
        const contaCorrente = this.contasService.criarContaCor(body.cliente);
        if (contaCorrente) {
            return contaCorrente;
        } else {
            throw new HttpException('Renda salarial insuficiente para abrir uma conta corrente.', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('criar/poupanca')
    criarContaPoupanca(@Body() body: { cliente: Cliente }): ContaPoupanca {
        return this.contasService.criarContaPop(body.cliente);
    }

    @Post('depositar')
    depositar(@Body() body: { conta: ContaBancaria, valor: number }): string {
        return this.contasService.depositar(body.conta, body.valor);
    }

    @Post('sacar')
    sacar(@Body() body: { conta: ContaBancaria, valor: number }): string {
        return this.contasService.sacar(body.conta, body.valor);
    }

    @Post('transferir')
    transferir(@Body() body: { contaOrigem: ContaBancaria, contaDestino: ContaBancaria, valor: number }): string {
        return this.contasService.transferir(body.contaOrigem, body.contaDestino, body.valor);
    }

    
}
