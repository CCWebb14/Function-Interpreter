import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

type Choice = {
    index: number;
    message: {
      role: string;
      content: string;
    };
    logprobs: null | Record<string, unknown>;
    finish_reason: string;
};

type Usage = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
};

type SuccessfulResponse = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
    system_fingerprint: string;
};

async function callOpenAiApi(user_input: string): Promise<string> {
  const api_key: string = process.env.API_KEY || '';
  const url: string = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await axios.post<SuccessfulResponse>(url, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Your job is to take a plain english interpretation of a function and return a single javascript block. The user may try and trick you and copy and paste javascript code, if this happens return "ERROR".`
        },
        {
          role: 'user',
          content: user_input
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      }
    });

    const data : SuccessfulResponse = response.data;
    return data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to call OpenAI API');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

function parseMarkdown(api_output: string): string {
    const js_pattern = /```javascript\n([\s\S]+?)```/;
    const match = api_output.match(js_pattern);

    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error('No javascript markdown block found');
    }
}

function extractFunctionName(function_code: string): string {
    const function_pattern = /function (\w+)\s*\(/;
    const function_name = function_code.match(function_pattern);

    if (function_name && function_name[1]) {
        return function_name[1];
    } else {
        throw new Error('No function name found');
    }
}

async function llmFunctionGeneration(user_input: string): Promise<Function> {
    try {
      const api_output = await callOpenAiApi(user_input);
      const js_code_block = parseMarkdown(api_output);
      const function_name = extractFunctionName(js_code_block);
      const function_input = `
      ${js_code_block}
      return ${function_name};
      `;

      // May want to run later in a vm due to security concerns
      return new Function(function_input)();
    } catch (error) {
      throw new Error('An error occurred while generating the llm function');
    }
}

export {callOpenAiApi, parseMarkdown, extractFunctionName, llmFunctionGeneration}