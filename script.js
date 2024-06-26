class Calculadora {

    constructor() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4
        };
        this.opAtual = this.op.NOP;
        this.simboloOperacao = ''; 
    }

    mostrarVisor() {
        if (this.estadoErro) {
            this.nrVisor = '0';
            return 'ERRO!';
        }
        if (this.nrVisor.length == 0) {
            this.nrVisor = '0';
        }
        let visor = '';
        visor += this.nrVisor;
        if (this.simboloOperacao !== '' && this.memTemp !== '') {
            visor = this.memTemp + ' ' + this.simboloOperacao + ' ' + this.nrVisor;
        }
        return visor;
    }

    // recebe dígito
    digito(dig) {
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
        }
        if (this.nrVisor.length == 10) return;
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ?  '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }

    // Definir qual a operação atual
    defineOperacao(op) {
        if (this.estadoErro) return;
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                this.simboloOperacao = "+";
                break;
            case '-':
                this.opAtual = this.op.SUB;
                this.simboloOperacao = "-"; 
                break;
            case '*':
                this.opAtual = this.op.MULT;
                this.simboloOperacao = "x"; 
                break;
            case '/':
                this.opAtual = this.op.DIV;
                this.simboloOperacao = "/"; 
                break;
        }
        this.memTemp = this.nrVisor;
    }

    // Executa operação: tecla IGUAL
    igual() {
        if (this.estadoErro) return;
        if (this.opAtual == this.op.NOP) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.DIV:
                if (num2 == 0) {
                    this.estadoErro = true;
                    return;
                }
                resultado = num1/num2;
                break;
            case this.op.MULT:
                resultado = num1*num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.SUM:
                resultado = num1 + num2;
                break;
        }
        this.opAtual = this.op.NOP;
        this.iniciouSegundo = false;
        this.ptDecimal = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Limpa dados (exceto memória)
    teclaC() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
        this.simboloOperacao = '';

        if (this.nrVisor === '-0') {
            this.nrVisor = '0';
            }
    }

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (this.estadoErro) return;
        this.memoria = 0;
    }

    // tecla Raiz: representar a tecla de raiz quadrada. Esta tecla substitui o conteúdo do visor pela sua raiz quadrada, mas não tem nenhum outro impacto nas demais operações.
    teclaRaiz() {
        if (this.estadoErro) return; // se estiver em estado de erro, a função retorna imediatamente.
        let numVisor = parseFloat(this.nrVisor); // transforma o número do visor atual de string para um float, para que possa manipular esse número
        if (numVisor < 0) { // se o número do visor for negativo, retornarrá "Erro" já que a raiz quadrada de um número negativo não é um número real
            this.estadoErro = true;
            return;
        }
        this.nrVisor = Math.sqrt(numVisor).toString().slice(0, 10); // o numero do visor é calculado a raiz (Math.sqrt) e transformado para String, além de ser limitado a ter no máximo 10 casas decimais no visor
    }

    // CALCULA A PORCENTAGEM DO NÚMERO NO VISOR 
    teclaPorcentagem() {
        if (this.estadoErro) return; // Verifica se está em estado de erro
        let numVisor = parseFloat(this.nrVisor); // Transforma o número do visor atual em float
        if (isNaN(numVisor)) { // Verifica se o número no visor é válido
            this.estadoErro = true;
            return;
        }
        let porcentagem = (parseFloat(this.memTemp) * numVisor) / 100; // Calcula a porcentagem usando o número na memória e o número atual no visor
        this.nrVisor = porcentagem.toString().slice(0, 10); // Atualiza o visor com o resultado da porcentagem, limitando a 10 caracteres
        atualizaVisor(); // Atualiza o visor no HTML
    }

    // ELEVA AO QUADRADO O NÚMERO INTRODUZIDO NO VISOR
    teclaQuadrado() {
        if (this.estadoErro) return; // Verifica se está em estado de erro
        let numVisor = parseFloat(this.nrVisor); // Converte o número do visor em float
        this.nrVisor = (numVisor * numVisor).toString().slice(0, 10); // Calcula o quadrado e atualiza o visor
        atualizaVisor(); // Atualiza o visor no HTML
    }

    teclaInverso() {
        if (this.estadoErro) return; // Verifica se está em estado de erro
         let numVisor = parseFloat(this.nrVisor); // Converte o número do visor em float
         if (numVisor == 0) { // Verifica se o número no visor é zero
         this.estadoErro = true;
         return;
     }
         this.nrVisor = (1 / numVisor).toString().slice(0, 10); // Calcula o inverso e atualiza o visor
  
     }

     teclaInversaoDeSinal(){
        if (this.estadoErro) return; // Verifica se está em estado de erro
    	let numVisor = parseFloat(this.nrVisor); // Converte o número do visor em float
    	this.nrVisor = (-numVisor).toString().slice(0, 10); // Inverte o sinal e atualiza o visor
    }

    // Tecla ON/OFF
    teclaOFF() {
        this.nrVisor = ' ';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.memoria = 0;
        this.opAtual = this.op.NOP;
        this.simboloOperacao = ''; 
    }

    teclaON() {
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.memoria = 0;
        this.opAtual = this.op.NOP;
        this.simboloOperacao = ''; 
    }
}

// ==================================================================
//  RESPOSTAS A EVENTOS DO HTML
// ==================================================================

// ATUALIZA O VALOR NO VISOR
let atualizaVisor = () => {
    document.getElementById('visor-id').innerHTML = calculadora.mostrarVisor();
}

// RECEBE UM DÍGITO (OU PONTO)
let digito = (dig) => {
    calculadora.digito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defOp = (op) => {
    if (calculadora.opAtual != calculadora.op.NOP) {
        defIgual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);
}

// CALCULA A OPERAÇÃO
let defIgual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}

// SUBSTITUI O CONTEÚDO DO VISOR
let teclaRaiz = () => {
    calculadora.teclaRaiz();
    atualizaVisor();
}

// CALCULA A PORCENTAGEM
let teclaPorcentagem = () => {
    calculadora.teclaPorcentagem();
    atualizaVisor();
}

// ELEVA O NÚMERO MOSTRADO NO VISOR AO QUADRADO
let teclaQuadrado = () => {
    calculadora.teclaQuadrado();
    atualizaVisor();
}

let teclaInverso= () => {
    calculadora.teclaInverso();
    atualizaVisor();
}
    
let teclaInversaoDeSinal = () => {
    calculadora.teclaInversaoDeSinal();
    atualizaVisor();
}

let teclaOFF = () => {
    calculadora.teclaOFF();
    atualizaVisor();
}

let teclaON = () => {
    calculadora.teclaON();
    atualizaVisor();
}

// ========================================================
//  INÍCIO DO PROCESSAMENTO
// ========================================================

let calculadora = new Calculadora();