const fs = require('fs').promises;
const cheerio = require('cheerio');


// 'C:\\dev\\workspaceMateus\\shang-tsung\\json-to-xml-by-map\\files\\jsonOut.json'
async function getJsonFile(pathFile){
    return await fs.readFile(pathFile,  'utf8');
}

async function getJsonFileParsed(pathFile){
    let jsonFile = await getJsonFile(pathFile);
    return JSON.parse(jsonFile);
}


async function getXmlInput(pathFile){

    let content =  await fs.readFile(pathFile,  'utf8');
    return cheerio.load(content, {xmlMode: true});
}

async function writeFile(pathFile, content){
    await fs.writeFile(pathFile, content);
}


module.exports = {
    getXmlInput: getXmlInput,
    getJsonFileParsed: getJsonFileParsed,
    writeFile: writeFile
};
