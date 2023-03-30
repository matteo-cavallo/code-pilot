import ora from "ora";
import {getCode, getFilePath} from "./utils.js";
import {sendMessage} from "./chatgpt.js";
import {filePath} from "./index.js";

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
    const path = filePath || await getFilePath()
    const code = await getCode(path)

    if(!path || !code){
        return
    }

    const response = await generateSummary(code, apiKey)
    console.log(`Summary:\n${response}`)
}

export { generateSummary, summary }
