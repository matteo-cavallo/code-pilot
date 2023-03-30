import prompts from "prompts";
import os from "os";
import fs from 'fs'

export const configFilePath = `${os.homedir()}/.gptcodereviewconfig`;

const getFilePath = async () => {
    const {path} = await prompts({
        type: 'text',
        name: 'path',
        message: 'What is the path of the file?'
    });

    return path
}

const getCode = async (path) => {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf-8");
    }
}

export {getCode, getFilePath}
