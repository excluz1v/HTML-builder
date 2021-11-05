const path = require('path');
const { readdir, rm, mkdir, copyFile, readFile, appendFile } = require('fs/promises');
const fs = require('fs');


const templatePath = path.join(__dirname, 'template.html');
const componentPath = path.join(__dirname, 'components');
const stylesFolderPath = path.join(__dirname, 'styles');
const stylesResultPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const projectdistPath = path.join(__dirname, 'project-dist', 'assets');


async function copyFolder(parentFolder, outputFolder) {
    await mkdir(outputFolder);
    const innerFolders = await readdir(parentFolder, { withFileTypes: true });
    await Promise.allSettled(innerFolders.map(elem => {
        let innerFolderPath = path.join(parentFolder, elem.name);
        let outputFolderPath = path.join(outputFolder, elem.name);
        if (elem.isDirectory()) {
            copyFolder(innerFolderPath, outputFolderPath);
        } else {
            copyFile(innerFolderPath, outputFolderPath);
        }
    }));
}


async function clean() {
    await rm(path.join(__dirname, 'project-dist'), { force: true, recursive: true });
    await mkdir(path.join(__dirname, 'project-dist'));
}

async function combineHtmlTemplate(templatePath, componentsPath) {
    let components = await readdir(componentsPath);
    let htmlParse = await readFile(templatePath, { encoding: 'utf-8' });
    let specifiedComponents = components.filter(compt => {
        let fileName = path.basename(compt, '.html');
        let regexp = createRegexp(fileName);
        return htmlParse.search(regexp) === -1
            ? false
            : true;
    });
    await Promise.allSettled(specifiedComponents.map(async (compnt) => {
        const filePath = path.join(componentsPath, compnt);
        let fileName = path.basename(compnt, '.html');
        let regexp = createRegexp(`{{${fileName}}}`);
        let fileParse = await readFile(filePath, { encoding: 'utf-8' });
        htmlParse = htmlParse.replace(regexp, fileParse);
    }));
    const htmlOutputPath = path.join(__dirname, 'project-dist', 'index.html');
    await appendFile(htmlOutputPath, htmlParse);
}

function createRegexp(regexFileName) {
    return new RegExp(regexFileName, 'g');
}

async function readFolder(folderPath) {
    let allFiles = await readdir(folderPath, { withFileTypes: true });
    return allFiles;
}

async function createCssBundle(inputFolderPath, outputFolder) {
    //delete bundle.css if exist
    const cssBundlePath = path.join(outputFolder, 'style.css');
    await rm(cssBundlePath, { force: true, recursive: true });

    //read files in folder
    let files = await readFolder(inputFolderPath);

    //filter only css
    let cssFiles = onlyCssFilter(files);
    for (let i = 0; i < cssFiles.length; i++) {
        //create stream and write it to new bundle.css
        const filePath = path.join(inputFolderPath, cssFiles[i].name);
        const myReadebleStream = fs.createReadStream(filePath, 'utf-8');

        myReadebleStream.on('data', async (chunk) => await appendFile(cssBundlePath, chunk));
    }
}

function onlyCssFilter(allFiles) {
    const cssFiles = allFiles.filter(file => (path.extname(file.name) === '.css' && file.isFile()));
    return cssFiles;
}

async function createBundle() {
    await clean();
    await copyFolder(assetsPath, projectdistPath);
    await createCssBundle(stylesFolderPath, stylesResultPath);
    await combineHtmlTemplate(templatePath, componentPath);
}
createBundle();

