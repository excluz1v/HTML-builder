const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');

// путь папки откуда копировать 
const copyFolder = path.join(__dirname, 'files-copy');

// пердварительная очистка конечной папки
async function cleanDirectory() {
    await rm(copyFolder, { force: true, recursive: true });
    await mkdir(copyFolder, { recursive: true });
}

// чтение файлов в диретории начальной
async function readFolder(folderPath) {
    const files = await readdir(folderPath);
    return files;
}

async function customCopyFiles() {
    try {
        await cleanDirectory();
        const inputFolderPath = path.join(__dirname, 'files');
        const files = await readFolder(inputFolderPath);
        for (let i = 0; i < files.length; i++) {
            const outputFileName = path.join(copyFolder, files[i]);
            const inputFilePath = path.join(inputFolderPath, files[i]);
            copyFile(inputFilePath, outputFileName);
        }
    } catch (error) {
        console.log(error);
    }
}

customCopyFiles();

