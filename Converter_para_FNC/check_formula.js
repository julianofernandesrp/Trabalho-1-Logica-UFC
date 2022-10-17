
const divCheck = document.querySelector('.nome');
const p1 = document.querySelector('.p1');
const p2 = document.querySelector('.p2');
const p3 = document.querySelector('.p3');
const p4 = document.querySelector('.p4');
const form = document.querySelector('.formula');
const fnc = document.querySelector('.convert_fnc');
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
    if(formula.length === 1 && formula.match(/[a-z]/i) || formula.length === 2 && (unary_connective_check(formula[0])) && formula[1].match(/[a-z]/i)){
        return true;
    }
    if(count_occurrence(formula) === (formula.length - 1) && formula[count_occurrence(formula)].match(/[a-z]/i)){
        return true;
    }
    for(let aux of formula){
         if(aux.match(/[a-z]/i)){
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
    if((count_letters < 2) || ((2 * count_binary_connective) !== count_auxiliary_symbols) || (count_auxiliary_symbols < 2) || count_binary_connective < 1){
       console.log('parou aqui -1');
        return false;
    }
    //até aqui funciona 

    for (let aux in formula){ //p(p#q)
        if(formula[aux].match(/[a-z]/i)){
            if(formula[parseInt(aux) + 1].match(/[a-z]/i) || unary_connective_check(formula[parseInt(aux) + 1]) || (formula[parseInt(aux) + 1] === '(')){
                console.log('parou aqui 0');
                return false;
            }
            continue;
        }
        //até aqui funciona
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
 function external_binnary_connective_index(formula){
    let count_parentheses = 0;
    let index = 0;

    for (let i of formula){
        if(i === '('){
            count_parentheses += 1;
        }else if(i === ')'){
            count_parentheses -= 1;
        }else if(count_parentheses === 1 && (i === '&' || i === '#' || i === '>')){
            return index;
        }
        index++;
    }
    return;
}

function implications_remove(formula){
    if(formula === formula.toLowerCase() && formula.length === 1){
        return formula;
    }
   //(p>q)
    if(formula[0] === '-'){
        return '-' + implications_remove(formula.slice(1)); 
    }
    let index = external_binnary_connective_index(formula);
    
    if(formula[index] === '>'){
        formula = '(-' + formula.slice(1,index) + '#' + formula.slice(index + 1);
        index += 1;
    }
    let form_left = implications_remove(formula.slice(1,index));
    let form_right = implications_remove(formula.slice(index + 1, -1));
    return '(' + form_left + formula[index] + form_right + ')';
}

function push(formula){
    let new_binnary_c;
    if(formula === formula.toLowerCase() && formula.length === 1){
        return formula;
    }
    if(formula[0] === '-'){
        if(formula[1] === '(' && formula[formula.length - 1] === ')'){
            let index = external_binnary_connective_index(formula);
            if(formula[index] === '#'){
                 new_binnary_c = '&';
            }else{
                 new_binnary_c = '#';
            }
            formula = '(-' + formula.slice(2, index) + new_binnary_c + '-' + formula.slice(index + 1);
        }else{
            return '-' + push(formula.slice(1));
        }
    }
    let idx = external_binnary_connective_index(formula);
    let form_left = push(formula.slice(1, idx));
    let form_right = push(formula.slice(idx + 1, -1));

    return '(' + form_left + formula[idx] + form_right + ')';
}
function negations_push(formula){
    const reg = /-\(/i;
    while(formula.search(reg) !== -1){
        formula = push(formula);
    }
    return formula;
}
function double_negations_remove(formula){
    const reg = /--/i;
    while(formula.search(reg) !== -1){
        formula = formula.replace('--', '');
    }
    return formula;
}


function distributivity_apply(formula){
    let form1;
    let form2;
    let form3;
    let form4;
    if(formula === formula.toLowerCase() && formula.length === 1){
        return formula;
    }
    if(formula[0] === '-'){
        return '-' + distributivity_apply(formula.slice(1));
    }
    let index = external_binnary_connective_index(formula);
    let is_apply = false;
    if(formula[index] === '#'){
        let subf = formula.slice(index + 1, -1);
        let sub_index = external_binnary_connective_index(subf);
       // console.log(subf[sub_index]);
        
        if(sub_index){
            if(subf[sub_index] === '&'){
                 form1 = formula.slice(1, index);
                 form2 = subf.slice(1, sub_index);
                 form3 = formula.slice(1, index);
                 form4 = subf.slice(sub_index + 1, -1);
                is_apply = true;
            }
        }      
        if(!is_apply){
            subf = formula.slice(1, index);
            sub_index = external_binnary_connective_index(subf);
                if(sub_index){
                    if(subf[sub_index] === '&'){
                         form1 = subf.slice(1, sub_index);
                         form2 = formula.slice(index + 1, -1);
                         form3 = subf.slice(sub_index + 1, -1);
                         form4 = formula.slice(index + 1, -1);
                        is_apply = true;
                        }
                    }
                }
    }
    if(is_apply){
        formula = '((' + form1 + '#' + form2 + ')&(' + form3 + '#' + form4 + '))';
        index = external_binnary_connective_index(formula);
    }
    
    let form_left = distributivity_apply(formula.slice(1, index));
    let form_right = distributivity_apply(formula.slice(index + 1, -1));
    return '(' + form_left + formula[index] + form_right + ')';

}

function unnecessary_parentheses_remove(formula){
    formula = formula.split('&')
    console.log(formula);
    
    const reg = /\(|\)/i;
    for (let i in formula){
        while(formula[i].search(reg) !== -1){
           formula[i] = formula[i].replace(reg, '');
        }
            formula[i] = '(' + formula[i] + ')';
        
    }
    formula = formula.join('&');
    return formula;

}

function formula_to_cnf(formula){
   if(!check_formula(formula)){
       console.log('deu ruim');
        divCheck.innerText = 'Não é fórmula';
        return 'não é possível realizar a conversão';
   }else{
        form.innerText = `Fórmula: ${formula}`;
       formula = implications_remove(formula);
       p1.innerHTML = `passo 1: ${formula}`;
       formula = negations_push(formula);
       p2.innerHTML = `passo 2: ${formula}`;
       formula = double_negations_remove(formula);
       p3.innerHTML = `passo 3: ${formula}`;
       formula = distributivity_apply(formula);
       p4.innerHTML = `passo 4: ${formula}`;
       formula = unnecessary_parentheses_remove(formula);
   }
   return formula;
}
fnc.innerText = `Fórmula convertida para FNC: ${formula_to_cnf(formula)}`;
//((p>q)>p)