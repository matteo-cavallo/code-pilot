import ora from "ora";
import {getSystemPrompt, sendMessage} from "./chatgpt.js";

/**
 * Generate a summary of the code
 * @param code
 * @return {Promise<string>}
 */
const summary = async (code, apiKey) => {
    const loading = ora('Doing magic...').start()
    const prompt = `You answer as concisely as possible. Write a summary of the code.`

    const options = {
        systemMessage: getSystemPrompt(code)
    }

    const response = await sendMessage(prompt, apiKey, options)
    loading.stop()
    console.log(`Summary:\n${response}`)
}

export { summary }
