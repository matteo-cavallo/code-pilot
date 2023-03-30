import ora from "ora";
import {sendMessage} from "./chatgpt.js";

/**
 * Identify issues in the code
 * @param code
 * @return {Promise<string>}
 */
const identifyIssues = async (code, apiKey) => {
    const loading = ora('Analyzing code...').start()
    const prompt = `Act as a code reviewer, can you identify any issues with this code?\n\n${code}`
    const response = await sendMessage(prompt, apiKey)
    loading.stop()
    console.log(`Issues:\n\n${response}`)
}

export { identifyIssues }
