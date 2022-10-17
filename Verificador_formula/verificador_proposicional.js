function scopeProtected(){
const a = document.querySelector('.nome');
let conta_letras = document.querySelector('.conta_letras');
let conta_aux_simbolos = document.querySelector('.conta_aux_simbolos');
let conta_conectivo_binario = document.querySelector('.conta_conectivo_binario');
let conta_conectivo_unario = document.querySelector('.conta_conectivo_unario');
const erro_lexico = document.querySelector('.erro_lexico');

const formula = prompt('Insira a fórmula desejada:');
console.log(formula);

const auxiliary_symbols = ['(', ')'];
const unary_connective = ['-'];
const binary_connective = [  '&', '#', '>'];

function unary_connective_check(car){
    for (let aux of unary_connective){
        if(aux == car){
            return true;
        }
    }
}

function binary_connective_check(car){
    for (let aux of binary_connective){
        if(aux == car){
            return true;
        }
    }
}

function auxiliary_symbols_check(car){
    for (let aux of auxiliary_symbols){
        if(aux == car){
            return true;
        }
    }
}
//verificar quantas ocorrências do conectivo unário tem 
function count_occurrence(formula){
    let count = 0;
    for(let aux of formula){
        if(aux === '-'){
            count++;
        }
    }
    return count;
}
//checando a fórmula
function check_formula(formula){
    let count_letters = 0;
    let count_binary_connective = 0;
    let count_unary_connective = 0;
    let count_auxiliary_symbols = 0;
    //verifica se a formula é de tamanho 1 e for uma letra e se for tamanho 2 verifica se possui o conectivo unario e seguida uma letra 
    if(formula === formula.toUpperCase()){
        erro_lexico.innerHTML = 'erro léxico, obedeça as restrições!';
        return false;
    }
    if(formula.length === 1 && formula.match(/[a-z]/i) || formula.length === 2 && (unary_connective_check(formula[0])) && formula[1].match(/[a-z]/i)){
        return true;
    }
    if(count_occurrence(formula) === (formula.length - 1) && formula[count_occurrence(formula)].match(/[a-z]/i)){
        return true;
    }
    for(let aux of formula){
         if(aux.match(/[a-z]/i)){
             console.log(aux);
            count_letters = count_letters + 1;
         } 
         if(auxiliary_symbols_check(aux)){
            count_auxiliary_symbols = count_auxiliary_symbols + 1;
         } 
         if(binary_connective_check(aux)){
            count_binary_connective = count_binary_connective + 1;
         } 
         if(unary_connective_check(aux)){
            count_unary_connective = count_unary_connective + 1;
         } 
     }  
        conta_letras.innerText = `Letras: ${count_letters}`;
        conta_aux_simbolos.innerText = `Simbolos auxiliares: ${count_auxiliary_symbols}`;
        conta_conectivo_binario.innerText = `Conectivos binários: ${count_binary_connective}`;
        conta_conectivo_unario.innerText = `Conectivos unários: ${count_unary_connective}`;

    if((count_letters < 2) || ((2 * count_binary_connective) !== count_auxiliary_symbols) || (count_auxiliary_symbols < 2) || count_binary_connective < 1){
        return false;
    }

    for (let aux in formula){ //p(p#q)
        if(formula[aux].match(/[a-z]/i)){
            if(formula[parseInt(aux) + 1].match(/[a-z]/i) || unary_connective_check(formula[parseInt(aux) + 1]) || (formula[parseInt(aux) + 1] === '(')){
                console.log('parou aqui 0');
                return false;
            }
            continue;
        }
        else if(auxiliary_symbols_check(formula[aux])){ //(p#q)
            console.log(formula[aux]);
            if(formula[aux] === '('){
                if(formula[parseInt(aux) + 1] === ')' || binary_connective_check(formula[parseInt(aux) + 1])){
                    console.log('parou aqui 1');
                    return false;
                }
            }else {
                if(formula[parseInt(aux) - 1] === '(' || unary_connective_check(formula[parseInt(aux) - 1]) || binary_connective_check(formula[parseInt(aux) - 1])){
                    return false;
                }
            }
            continue;
        }
        else if(unary_connective_check(formula[aux])){
            if(formula[parseInt(aux) + 1].match(/[a-z]/i) || formula[parseInt(aux) + 1] === '(' || unary_connective_check(formula[parseInt(aux) + 1])){
                continue;
            }else{
                console.log('parou aqui 2');
                return false;
            }
        }
        else if(binary_connective_check(formula[aux])){
            if(binary_connective_check(formula[parseInt(aux) + 1]) || formula[parseInt(aux) + 1] === ')'){
                console.log('parou aqui 3');
                return false;
            }
            continue;
        }else {
            console.log('parou aqui 4');
            return false;
        }
        
    }
    return true;
    
    
}

if(check_formula(formula)){
    a.innerHTML = `${formula}: é fórmula`;
}else{
    a.innerHTML = `${formula}: não é fórmula`;
}

}

scopeProtected();