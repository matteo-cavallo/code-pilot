import {ChatGPTAPI} from 'chatgpt';
import fs from 'fs';
import os from 'os'
import prompts from 'prompts'
import ora from 'ora'

const configFilePath = `${os.homedir()}/.gptcodereviewconfig`;

// Good code

const sendMessage = async (prompt, apiKey) => {
    const api = new ChatGPTAPI({apiKey});

    const res = await api.sendMessage(prompt);
    return res.text;
};

async function getApiKey() {
    if (fs.existsSync(configFilePath)) {
        return fs.readFileSync(configFilePath, "utf-8");
    }

    const apiKey = await promptApiKey();
    fs.writeFileSync(configFilePath, apiKey);
    return apiKey;
}

/**
 * Prompt OpenAI Api Key
 * @return {Promise<*>}
 */
const promptApiKey = async () => {
    const {apiKey} = await prompts({
        type: "password",
        name: "apiKey",
        message: "Enter your OpenAI API key:",
    });

    return apiKey;
};

/**
 * Generate a summary of the code
 * @param code
 * @return {Promise<string>}
 */
const generateSummary = async (code, apiKey) => {
    const loading = ora('Doing magic...').start()
    const prompt = `Act as a code reviewer, you make a brief summary of this code:\n\n${code}`
    const response = await sendMessage(prompt, apiKey)
    loading.stop()
    return response
}

const summary = async (apiKey) => {
    const path = await getFilePath()
    const code = await getCode(path)

    if(!path | !code){
        return
    }

    const response = await generateSummary(code, apiKey)
    console.log(response)
}

const getFilePath = async () => {
    const {path} = await prompts({
        type: 'text',
        name: 'path',
        message: 'What is the path of the file?',
        initial: './index.js'
    });

    return path
}

const getCode = async (path) => {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, "utf-8");
    }
}

const run = async () => {
    const apiKey = await getApiKey()

    const {selection} = await prompts({
        type: 'select',
        name: 'selection',
        message: 'What can I do for you?',
        choices: [
            {title: 'Explain code', description: 'Write a brief summary of the code.', value: 'summary'},
        ]
    })

    switch (selection) {
        case 'summary':
            await summary(apiKey)
            break
    }
}

run()
