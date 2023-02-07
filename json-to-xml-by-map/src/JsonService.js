
function isArray(a) {
    return (!!a) && (a.constructor === Array);
}

function isObject(a) {
    return (!!a) && (a.constructor === Object);
}

async function buidlParam(json, jsonReference){

    return {
        "key_increment": json,
        "atribute_search": `${jsonReference}`,
        "found": [],
    };
}
/**

 let param = {
    "key_increment": "json",
    "atribute_search": "clientes",
    "found": [],
};
**/

function copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
}


//todo FUNCIONA pra mais de um obj; por exemplo: busque todos os enderesços em: (clientes)
//todo depois tentar integrar uma forma de gerar o xml apenas para os níveis mais profundos
async function getAtributeLegacyGetAllOcurrencies(param){

    for(let key in param.key_increment){

        let value = param.key_increment[key];

        if(key === param.atribute_search){

            let obj = {
                content: value
            };

            param.found.push(obj);
        }

        if(isArray(value)){
            for(let item of value){
                param.key_increment = item;
                await getAtribute(param);
            }
        }

        if (isObject(value)) {
            await getAtribute(param.key_increment);
        }
    }
}


/**

 temos um problema ao tentar buscar em um nível profundo, investigar depois:

 tentando buscar apenas:

 <enderecos jsonReference="enderecos">
 <endereco jsonReference="endereco">
 </endereco>
 </enderecos>
 **/
//todo não funciona pra mais de um obj; por exemplo: busque todos os enderesços em: (clientes)
async function getAtribute(param){

    for(let key in param.key_increment){

        let value = param.key_increment[key];

        if(key === param.atribute_search){

            let obj = {
                content: value
            };

            param.found.push(obj);
            return;
        }

        if(isArray(value)){
            for(let item of value){
                let newParam = copyObj(param);
                newParam.key_increment = item;
                await getAtribute(newParam);
            }
        }

        if (isObject(value)) {
            // param.key_increment = key;
            await getAtribute(param.key_increment);
        }
    }
}



module.exports = {
    buidlParam: buidlParam,
    getAtribute: getAtribute,
    isArray: isArray,
    isObject: isObject
};
