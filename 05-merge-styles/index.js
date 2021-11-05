const { readdir, rm, appendFile } = require('fs/promises');
const path = require('path');
const fs = require('fs');


const stylesFolderPath = path.join(__dirname, 'styles');
const stylesResultPath = path.join(__dirname, 'project-dist');

async function readFolder(folderPath) {
    let allFiles = await readdir(folderPath, { withFileTypes: true });
    return allFiles;
}

async function createCssBundle(inputFolderPath, outputFolder) {
    //delete bundle.css if exist
    const cssBundlePath = path.join(outputFolder, 'bundle.css');
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


createCssBundle(stylesFolderPath, stylesResultPath);
