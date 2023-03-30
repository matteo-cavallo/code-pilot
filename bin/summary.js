import ora from "ora";
import {sendMessage} from "./chatgpt.js";

/**
 * Generate a summary of the code
 * @param code
 * @return {Promise<string>}
 */
const summary = async (code, apiKey) => {
    const loading = ora('Doing magic...').start()
    const prompt = `Act as a code reviewer, you make a brief summary of this code:\n\n${code}`
    const response = await sendMessage(prompt, apiKey)
    loading.stop()
    console.log(`Summary:\n${response}`)
}

export { summary }
