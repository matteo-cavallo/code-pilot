import ora from "ora";
import {getSystemPrompt, sendFullMessage, sendMessage} from "./chatgpt.js";
import prompts from "prompts";

/**
 * Identify issues in the code
 * @param code
 * @return {Promise<string>}
 */
const identifyIssues = async (code, apiKey) => {
    const loading = ora('Analyzing code...').start()

    const template = '[{"title": "Title of the issue", "description": "This is a short description of the issue.", "value": "issue-id"}]'
    const prompt = `You identify possible issues and bugs. If there are issues you answer with just the array of issues using this template: ${template}, else you answer with just an empty array.`

    const options = {
        systemMessage: getSystemPrompt(code)
    }

    const response = await sendFullMessage(prompt, apiKey, options)
    loading.stop()

    try {
        const formattedResponse = response.text.trim() == '[]' ? [] : `[${response.text.split('[')[1].split(']')[0]}]`

        const issuesList = JSON.parse(formattedResponse)

        if(!formattedResponse){
            console.log('Nothing to fix!')
            throw Error
        }

        const {issue} = await prompts({
            type: 'select',
            name: 'issue',
            message: 'Select the issue you want to fix.',
            choices: [...issuesList, {title: "Cancel", value: 'cancel-value'}]
        })

        if(issue == 'cancel-value'){
            console.log('Ok. Fine.')
            return null
        }

        const issueDescription = issuesList.find(res => res.value === issue).description
        loading.start('Coming up with a solution...')
        const fixResponse = await sendMessage(`Explain the fix and write a solution for this issue: ${issueDescription}`, apiKey, {parentMessageId: response.id})
        loading.stop()
        console.log(`This is the fix:\n${fixResponse}`)
    } catch (e) {
        console.error('Failed to parse the response. Anyway this is the raw response: ', response.text)
    }

}

export { identifyIssues }
