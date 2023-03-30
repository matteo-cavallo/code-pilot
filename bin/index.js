#!/usr/bin/env node
import prompts from 'prompts'
import args from 'args'
import {summary} from "./summary.js";
import {getApiKey} from "./chatgpt.js";

args.option('filePath', 'The path of the file')
export const {filePath} = args.parse(process.argv)

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
