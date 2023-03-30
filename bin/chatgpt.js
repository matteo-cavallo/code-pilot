import {ChatGPTAPI} from "chatgpt";
import prompts from "prompts";
import fs from 'fs'
import {configFilePath} from "./utils.js";

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
 * Reset OpenAI Api Key
 * @return {Promise<void>}
 */
const reset = async () => {
    if (fs.existsSync(configFilePath)) {
        fs.unlinkSync(configFilePath);
        console.log('API key has been reset.');
    } else {
        console.log('No API key found.');
    }
}

export {getApiKey, promptApiKey, sendMessage, reset}
