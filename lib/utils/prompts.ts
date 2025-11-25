import { PromptProps } from '../types'

export async function simplePrompt(props: PromptProps): Promise<string> {
    return `Provide investment strategies for a user with the following crypto portfolio:
${JSON.stringify(props.portfolio)}
Be concise, specific and precise in your instruction in each strategy action. 
`
}
