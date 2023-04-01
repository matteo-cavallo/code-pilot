import ora from "ora";
import {getSystemPrompt, sendMessage} from "./chatgpt.js";
import prompts from "prompts";

/**
 * Custom request in your code
 * @param code
 * @return {Promise<string>}
 */
const customRequest = async (code, apiKey) => {
    const {request} = await prompts({
        type: 'text',
        name: 'request',
        message: 'Write your request:'
    })

    if(!request){
        return
    }

    const loading = ora('Analyzing code...').start()
    const prompt = `${request}`


    const options = {
        systemMessage: getSystemPrompt(code)
    }

    const response = await sendMessage(prompt, apiKey, options)
    loading.stop()
    console.log(`Response:\n${response}`)
}

export { customRequest }
