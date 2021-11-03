const path = require('path');
const { readdir, stat } = require('fs/promises');

const secretFolder = createPath('secret-folder');

function createPath(folderName) {
    return path.join(__dirname, folderName);
}

function getFileSize(fileSize) {
    return `${(fileSize / 1024)}kb`;
}

async function fileCheck(folderPath, arr = []) {
    try {
        const files = await readdir(folderPath);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filesPath = path.join(folderPath, file);
            let fileStats = await stat(filesPath);
            const fileSize = getFileSize(fileStats.size);
            const extenstion = path.extname(file).replace('.', '');
            const name = path.basename(file, extenstion).replace('.', '');
            const total = `${name} - ${extenstion} - ${fileSize}`;
            if (fileStats.isFile()) {
                arr = [...arr, total];
            }
        }
        return arr;
    } catch (error) {
        console.log(error);
    }
}


async function readFolderFiles(folderPath) {
    let result = [];
    try {
        let files = await fileCheck(folderPath, result);
        console.log(files);
    } catch (error) {
        console.log(error);
    }

}

readFolderFiles(secretFolder);

