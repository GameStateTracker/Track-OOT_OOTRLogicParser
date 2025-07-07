import fs from "fs";
import path from "path";

const __dirname = path.resolve();

export function loadDictFolder(folderPath) {
    const data = {};

    const resolvedFolderPath = path.join(__dirname, folderPath);
    if (fs.existsSync(resolvedFolderPath)) {
        try {
            const folderContent = fs.readdirSync(resolvedFolderPath);
            for (const filePath of folderContent) {
                const resolvedFilePath = path.resolve(resolvedFolderPath, filePath);
                try {
                    const fileContent = fs.readFileSync(resolvedFilePath).toString();
                    try {
                        const fileData = JSON.parse(fileContent);
                        if (typeof fileData !== "object" || Array.isArray(fileData)) {
                            const parsedPath = path.parse(filePath);
                            const name = parsedPath.name;
                            console.error(`DictFolder: file data is not a dict [${folderPath} > ${name}]`);
                            continue;
                        }
                        for (const key in fileData) {
                            data[key] = fileData[key];
                        }
                    } catch {
                        const parsedPath = path.parse(filePath);
                        const name = parsedPath.name;
                        console.error(`DictFolder: file data is not in valid json format [${folderPath} > ${name}]`);
                    }
                } catch {
                    const parsedPath = path.parse(filePath);
                    const name = parsedPath.name;
                    console.error(`DictFolder: file could not be opened [${folderPath} > ${name}]`);
                }
            }
        } catch {
            console.error(`DictFolder: error reading folder [${folderPath}]`);
        }
    } else {
        console.warn(`DictFolder: folder does not exist [${folderPath}]`);
    }

    return data;
}

export function loadArrayFolder(folderPath) {
    const data = [];

    const resolvedFolderPath = path.join(__dirname, folderPath);
    if (fs.existsSync(resolvedFolderPath)) {
        try {
            const folderContent = fs.readdirSync(resolvedFolderPath);
            for (const filePath of folderContent) {
                const resolvedFilePath = path.resolve(resolvedFolderPath, filePath);
                try {
                    const fileContent = fs.readFileSync(resolvedFilePath).toString();
                    try {
                        const fileData = JSON.parse(fileContent);
                        if (!Array.isArray(fileData)) {
                            const parsedPath = path.parse(filePath);
                            const name = parsedPath.name;
                            console.error(`ArrayFolder: file data is not an array [${folderPath} > ${name}]`);
                            continue;
                        }
                        for (const entry of fileData) {
                            data.push(entry);
                        }
                    } catch {
                        const parsedPath = path.parse(filePath);
                        const name = parsedPath.name;
                        console.error(`ArrayFolder: file data is not in valid json format [${folderPath} > ${name}]`);
                    }
                } catch {
                    const parsedPath = path.parse(filePath);
                    const name = parsedPath.name;
                    console.error(`ArrayFolder: file could not be opened [${folderPath} > ${name}]`);
                }
            }
        } catch {
            console.error(`ArrayFolder: error reading folder [${folderPath}]`);
        }
    } else {
        console.warn(`ArrayFolder: folder does not exist [${folderPath}]`);
    }

    return data;
}
