#!/usr/bin/env node
import prompts from 'prompts'
import args from 'args'
import {getApiKey, reset } from "./chatgpt.js";
import {identifyIssues} from "./issues.js";
import {getCode, getFilePath} from "./utils.js";
import {summary} from "./summary.js";
import {customRequest} from "./custom.js";

args
    .option('filePath', 'The path of the file')
    .option('resetApiKey', 'Serve your static site')

export const {filePath, resetApiKey} = args.parse(process.argv)

const run = async () => {
    if (resetApiKey) {
        const confirm = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Are you sure you want to reset the OpenAI API key?'
        })

        if (confirm.value) {
            await reset()
            console.log('OpenAI API key has been reset.')
            return
        } else {
            console.log('OpenAI API key was not reset.')
            return
        }
    }

    const apiKey = await getApiKey()

    const {selection} = await prompts({
        type: 'select',
        name: 'selection',
        message: 'What can I do for you?',
        choices: [
            {title: 'Explain code', description: 'Write a brief summary of the code.', value: 'summary'},
            {title: 'Identify issues', description: 'Identify any issues with the code.', value: 'issues'},
            {title: 'Custom request', description: 'Ask anything regarding the code', value: 'custom'},
        ]
    })

    const path = filePath || await getFilePath()
    const code = await getCode(path)

    if(!path){
        console.log('Please, provide a path.')
        return
    }

    if(!code){
        console.log('Please, make sure there is a code to analyze.')
        return
    }

    switch (selection) {
        case 'summary':
            await summary(code,apiKey)
            break
        case 'issues':
            await identifyIssues(code, apiKey)
            break
        case 'custom':
            await customRequest(code, apiKey)
            break
        default:
            console.log('Invalid selection')
    }
}

run()
