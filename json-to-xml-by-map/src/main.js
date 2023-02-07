const fs = require('fs').promises;
const cheerio = require('cheerio');
const jsonService = require('./JsonService');
const files = require('./files');
const xmlBeautifier = require("xml-beautifier");



async function newXmlCheerio(){
    return cheerio.load("", {xmlMode: true});
}

function getJsonReferenceOfNode(element){
    return element.attribs["jsonReference"];
}


function attributesIdentify(node){

    if(JSON.stringify(node.attribs).includes("$$")){
        return true;
    }

    return false;
}



async function newTag(node, jsonValue){

    //todo criar content
    let content = "";
    let attributesConcat = "";

    if(jsonValue && !jsonService.isObject(jsonValue)){
        content = jsonValue;
    }

    for(let att in node.attribs){

        if(att !== "jsonReference"){

            let contentAttribute = node.attribs[att];

            let attributesValueOnJson = contentAttribute;

            if(contentAttribute.includes("$$")){
                if(jsonValue){
                    attributesValueOnJson = jsonValue[contentAttribute.replace("$$", "")];
                }else{
                    console.log("==========> json value não existe para o node", node.name);
                }
            }


            attributesConcat = attributesConcat + `${att}="${attributesValueOnJson}" `;
        }
    }

    if(content){
        return `<${node.name} ${attributesConcat}> ${content} </${node.name}>`;
    }

    return `<${node.name} ${attributesConcat} />`;
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


function formatXml(xmlCheerio){
    let xmlContent = xmlCheerio.xml();
    return xmlBeautifier(xmlContent);
}



async function giveMeElementAppend(nodeNew, tagStr){

    let cheerioTag = cheerio.load(tagStr, {xmlMode: true});
    let root = cheerioTag("root")._root;
    let onlySon = root[0].children[0];

    for(let item of nodeNew.children){

        if(item.type === "tag"){

            if(item.name === onlySon.name &&
               JSON.stringify(item.attribs) === JSON.stringify(onlySon.attribs)){
               return item;
            }
        }
    }
}

async function loopTagsXML(nodeMap, nodeNew, xmlCheerio, json){

    console.log("*");
    let nodesChildren = getChildrenTagsOf(nodeMap);

    for(let node of nodesChildren) {

        let jsonReference = getJsonReferenceOfNode(node);

        if(!jsonReference){
            let tagStr = await newTag(node, undefined);

            xmlCheerio(nodeNew).append(tagStr);
            let element = await giveMeElementAppend(nodeNew, tagStr);

            await loopTagsXML(node, element, xmlCheerio, json);
        }

        if(jsonReference){
            let param = await jsonService.buidlParam(json, jsonReference);
            await jsonService.getAtribute(param);

            for (let item of param.found) {

                if(jsonService.isArray(item.content)){

                    for(let found of item.content){

                        let tag = await newTag(node, found);

                        let element = await giveMeElementAppend(nodeNew, tag);

                        if(!element){
                            xmlCheerio(nodeNew).append(tag);
                        }

                        element = await giveMeElementAppend(nodeNew, tag);

                        await loopTagsXML(node, element, xmlCheerio, found);
                    }

                }else{
                    let tag = await newTag(node, item.content);

                    xmlCheerio(nodeNew).append(tag);
                    let element = await giveMeElementAppend(nodeNew, tag);

                    await loopTagsXML(node, element, xmlCheerio, item.content);
                }
            }

        }

    }
}


function getParameter(number){
    return process.argv[number];
}


async function main() {

    let mask_xml = getParameter(2);
    let json_input = getParameter(3);
    let xml_output = getParameter(4);

    console.log("mask_xml ===> ", mask_xml);
    console.log("json_input ===> ", json_input);
    console.log("xml_output ===> ", xml_output);

    let mapXMLCheerio = await files.getXmlInput(mask_xml);
    let mapXMLRoot = mapXMLCheerio._root;

    let newXMLCheerio = await newXmlCheerio();
    let newXMLRoot = newXMLCheerio._root;

    let json = await files.getJsonFileParsed(json_input);
    //console.log("quantidade de itens carregados", json.Doc3040[0].Cli.length);

    await loopTagsXML(mapXMLRoot, newXMLRoot, newXMLCheerio, json);

    let xml = formatXml(newXMLCheerio);
    await files.writeFile(xml_output, xml);

    console.log("***************************************");
}

main();
