const fs = require('fs').promises;
const cheerio = require('cheerio');
const xmlbuilder = require("xmlbuilder2");


async function getJsonFile(){
    return await fs.readFile('C:\\dev\\workspaceMateus\\shang-tsung\\json-to-xml-by-map\\files\\jsonOut.json',  'utf8');
}


async function getXmlInput(){

    let content =  await fs.readFile('C:\\dev\\workspaceMateus\\shang-tsung\\json-to-xml-by-map\\files\\xml_mask.xml',  'utf8');
    return cheerio.load(content, {xmlMode: true});
}


async function newXmlCheerio(){
    return cheerio.load("", {xmlMode: true});
}

function buildXmlRootNode(){
    return xmlbuilder.create({ version: '1.0', encoding: "UTF-8"})
}


function testBuildXmlExample(){

    const R = [{name: 'foo1', sku: 'bar1'}, {name:'foo2', sku: 'bar2'}];
    let xml = xmlbuilder.create({ version: '1.0', encoding: "UTF-8"})
                                .ele('ListingDataFeed')
                                .ele('Listings');

    for(let i = 0; i<R.length;i++){
        xml.ele("Listing")
            .ele("listingId: ", `${R[i].sku}`).up()
            .ele('Title').dat(`${R[i].name}`).up().up();
        //rest of your code
    }

    xml = xml.end({ prettyPrint: true });
    console.log(xml);
}


function isArray(a) {
    return (!!a) && (a.constructor === Array);
}

function isObject(a) {
    return (!!a) && (a.constructor === Object);
}


function buildXmlRecursive(xmlNew, xmlMap, propertyFather, obj){

    console.log("objeto recebido ==> ", obj);

    for (let prop in obj) {

        let property = prop;
        let propertyValue = obj[prop];
        console.log("property ", property);
        console.log("propertyValue ", propertyValue);

        if(isArray(propertyValue)){

            let element = xmlMap(property);
            xmlNew.ele(element);

            for( let item of propertyValue){

                console.log("item do array ==>", propertyValue);
                buildXmlRecursive(xmlNew, xmlMap, property, item);
            }
        }

        if(isObject(propertyValue)){

            console.log("passando obj ...");
            buildXmlRecursive(xmlNew, xmlMap, property, propertyValue);
        }
    }
}


function getChildrenTagsOf(node){

    let tags = [];

    for(let item of node.children){

        if(item.type === "tag"){
            tags.push(item);
        }
    }

    return tags;
}

function getTagsOf(node){

    let tags = [];

    for(let item of node){

        if(item.type === "tag"){
            tags.push(item);
        }
    }

    return tags;
}

function getTextOf(node){

    let text = [];

    for(let item of node){

        if(item.type === "text"){
            text.push(item);
        }
    }

    return text;
}

function printXml(xmlCheerio){
    console.log(xmlCheerio.xml())
}

function addAfter(node, content, xmlCheerio){
    xmlCheerio(node.name).after(content);
}


function getTagFather(node, atributesObj, xmlCheerio){

    if(node.parent.type === "root"){
        return xmlCheerio("root")._root;
    }

    let elementList = xmlCheerio(node.parent.name);

    if(elementList.length === 1){
        return elementList[0];
    }

    for(let element of elementList){

        if(element.attribs === atributesObj){
            return element;
        }
    }
}



async function append(node, content, xmlCheerio){

    if(node.parent.type === "root"){
        xmlCheerio("root")._root.append(content);
        return;
    }

    console.log("adicionando no pai " , node.parent.name);
    console.log("o conteúdo: " , content);

    //todo verificar content tem identificador

    let found = xmlCheerio(node.parent.name);

    if(found.length === 2){
        console.log("found é 2");
    }

    xmlCheerio(node.parent.name).append(content);

    console.log("=====================");
    printXml(xmlCheerio);
}

function getRootElement(xmlMap){
    let root = xmlMap._root;
    return getTagsOf(root.children);
}

function getJsonReference(element){
    return element.attribs["jsonReference"];
}

function printAllTagOfXml(xmlCheerio){

    let elemtentsName = xmlCheerio('*').contents()
        .filter((index, element) => { return element.type === 'tag' })
        .map((index, element) => { return element.name } )
        .get();

    console.log(elemtentsName);
}





function createXmlByInput(json, xml){

    // xml("root")._root[0].childNodes[0].childNodes[1]
    // xml("root")._root[0];
    let bodyElement = xml("body");


    //todo É POSSIVEL PEGAR ASSIM
    let ele = xml("clientes>cliente>telefone>ligacoes_locais");


    for(let atribute of json){


        if(isArray(atribute)){


        }
    }

    //
    // let tagOfBody = getTagOf(bodyElement);
    // let deepTagOfBody = getTagOf(tagOfBody.children);
    // let deepOfDeepTagOfBody = getTagOf(deepTagOfBody.children);
    // let ok = getTagOf(deepOfDeepTagOfBody.children);
    // let ok2 = getTagOf(ok.children);

    // bodyElement.map((item) => {
    //
    //     console.log(item);
    //
    // });

    console.log("xml", xml);
}



// console.log(responseJson);
// let xml = buildXmlRootNode();
// xml = xml.end({ prettyPrint: true });
// buildXmlRecursive(xml, cheerioXML, null, obj);
// loopXmlMap(cheerioXML)


function addAttributeNode(node, json){

    for(let attribute in node.attribs){

        if(attribute !== "jsonReference" && json[attribute]){
            node.attribs[attribute] = json[attribute];
        }
    }
}


function copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
}

function changeNodeOrAddNew(node, json){

    let jsonCopy = copyObj(node.attribs);
    delete jsonCopy["jsonReference"];

    let numberAttributes = Object.keys(jsonCopy).length;

    for(let attribute in node.attribs){

        if(attribute !== "jsonReference" && json[attribute]){

            console.log(attribute);
        }

    }
}



function getJsonAttribute(){

}


async function loopXmlMap(node, json, xmlMap, newXml, nodeNewXml){

    let nodeList = getTagsOf(node.children);

    for(let node of nodeList){

        let jsonReference = getJsonReference(node);
        let found = json[jsonReference];
        console.log(found);

        if(isArray(json)){

            for(let item of json){

                let recursiveNode = newXml(node.name)[0];

                if(recursiveNode && recursiveNode.constructor.name === "Element"){
                    nodeNewXml = recursiveNode;
                    addAfter(nodeNewXml, `<${node.name}> </${node.name}>`, newXml);
                }else{
                    append(nodeNewXml, `<${node.name}> </${node.name}>`, newXml);
                }

                loopXmlMap(node, item, xmlMap, newXml, nodeNewXml);
            }
        }

        if(isObject(json)){

            let recursiveNode = newXml(node.name)[0];

            if(recursiveNode && recursiveNode.constructor.name === "Element"){
               nodeNewXml = recursiveNode;
                addAfter(nodeNewXml, `<${node.name}> </${node.name}>`, newXml);
            }else{
                append(nodeNewXml, `<${node.name}> </${node.name}>`, newXml);
            }

            loopXmlMap(node, found, xmlMap, newXml, nodeNewXml);
        }
    }

}



function addTag(newXml, node, tag){

    let recursiveNode = newXml(node.name)[0];

    if(recursiveNode && recursiveNode.constructor.name === "Element"){
        //nodeNewXml = recursiveNode;
        addAfter(nodeNewXml, `${tag}`, newXml);
    }else{
        append(nodeNewXml, `${tag}`, newXml);
    }
}

function getAttributeFromJson(json, attributeName){

    //todo melhorar esse método

    return json[attributeName];
}

async function buildNewTagWithJsonValue(node, jsonValue){

    // console.log(node);
    let content = "";
    let attributesConcat = "";

    // let textList = getTextOf(node.children);
    //
    // if(textList.length === 1 && textList[0].data.includes("$$")){
    //
    //     let jsonReference = node.attribs["jsonReference"];
    //     let atributesValueOnJson = jsonValue[jsonReference.replace("$$", "")];
    //
    //     content = content + atributesValueOnJson;
    // }


    for(let att in node.attribs){

        if(att !== "jsonReference"){
            console.log(att);

            let contentAtribute = node.attribs[att];
            let atributesValueOnJson = jsonValue[contentAtribute.replace("$$", "")];

            attributesConcat = attributesConcat + `${att}="${atributesValueOnJson}" `;
        }
    }

    return `<${node.name} ${attributesConcat}> ${content} </${node.name}>`;
}

function buildTag(node){
    return `<${node.name}> </${node.name}>`;
}

async function buildTagList(node){
    return `<${node.name} list> </${node.name}>`;
}


/**
 let param = {
        "key_increment": json
        "atribute_search": "numero",
        "path": "",
        "found": "",
    };
 **/

async function getAtribute(param){

    for(let key in param.key_increment){

        param.path = param.path + `${key}.`;
        console.log(`key: ${key}, value: ${param.key_increment[key]}`);

        if(key === param.atribute_search){

            let saveParam = param.path;

            let obj = {
                path: saveParam,
                content: JSON.stringify(param.key_increment[key])
            };

            param.path = "";
            param.found.push(obj);
        }

        if(isArray(param.key_increment[key])){

            let count = 0;

            for(let item of param.key_increment[key]){

                param.path = param.path + `${count}.`;
                count++;

                param.key_increment = item;
                await getAtribute(param);
            }
        }

        if (isObject(param.key_increment[key])) {

            param.key_increment = key;
            await getAtribute(param);
        }
    }
}


async function loopTagsOfXml(nodeMap, json, listResponse){

    let nodesChildren = getChildrenTagsOf(nodeMap);

    for(let node of nodesChildren) {

        let jsonReference = getJsonReference(node);

        if(jsonReference.includes("_item")){
            jsonValue = json;
        }else{
            jsonValue = json[attributeName];
        }

        let param = {
            "key_increment": json,
            "atribute_search": `${jsonReference}`,
            "path": "",
            "found": "",
        };

        let response = await getAtribute(param);
        listResponse.push(response);

        console.log(node.name);
        await loopTagsOfXml(node);
    }
}



async function loopXmlTest(nodeMap, json, nodeNewXml, newXml){

    let nodesChildren = getChildrenTagsOf(nodeMap);

    for(let node of nodesChildren) {

        let attributeName = getJsonReference(node);

        let jsonValue;

        if(attributeName.includes("_item")){
            jsonValue = json;
        }else{
            jsonValue = json[attributeName];
        }


        if(isArray(jsonValue)){

            let newTag = await buildTagList(node);
            console.log(`${newTag}`);

            let father = getTagFather(node, jsonValue, newXml);
            newXml(father).append(newTag);
            //await append(node, newTag, newXml);

            for(let item of jsonValue){
                // console.log(`${JSON.stringify(item)}`);
                await loopXmlTest(node, item, nodeNewXml, newXml);
            }

        }

        if(isObject(jsonValue)){

            // let newTag = buildNewWithJsonValue(node, jsonValue);
            let newTag = await buildNewTagWithJsonValue(node, jsonValue);

            let father = getTagFather(node, jsonValue, newXml);
            newXml(father).append(newTag);
            // console.log(`${newTag}`);

            await append(node, newTag, newXml);

            // pega a tag e a diciona as propriedades desse obj
            // console.log(`${JSON.stringify(jsonValue)}`);

            await loopXmlTest(node, jsonValue, nodeNewXml, newXml);

        }

    }
}



async function main(){
    let responseJson = await getJsonFile();
    let json = JSON.parse(responseJson);
    let mapXML = await getXmlInput();

    let newXml = await newXmlCheerio();
    // let rootElement = getRootElement(cheerioXML);

    let nodeRootMap = mapXML._root;
    let nodeRootNewXml = newXml._root;

    // loopXmlMap(nodeRootMap, json, mapXML, newXml, nodeRootNewXml);

    // await loopXmlTest(nodeRootMap, json, nodeRootNewXml, newXml);

    let listResponse = [];

    await loopTagsOfXml(nodeRootMap, json, listResponse);

    // printXml(newXml);
}


main();
