import axios from 'axios';
import { configDotenv } from 'dotenv';

configDotenv();

// Type definitions for expected json response from llm api
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


// Function that handles the api post request to an llm
async function callModelAPI(user_input: string): Promise<string> {
  // Import API_KEY from .env file
  const api_key: string = process.env.API_KEY
  console.log(api_key);
  // Endpoint for ollama's generate 
  const url: string = 'https://api.openai.com/v1/chat/completions';

  // Control flow for submitting an api message to the model
  // Always prompts the model with a system message.
  // This message prompts the model to expect a plain english interpretation of a function and to return a javascript block.
  try {
    const response = await axios.post<SuccessfulResponse>(url, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Your job is to take a plain english interpretation of a function and return a single javascript block.`
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

    const data: SuccessfulResponse = response.data;
    return data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to call OpenAI API');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

// Function that parses for markdown blocks and returns the content
// Utilizes regex to detect both (```javascript{content}```) and (```{content}```) blocks
function parseMarkdown(api_output: string): string {
  const js_pattern = /```javascript([\s\S]+?)```/
  const js_match = api_output.match(js_pattern);

  if (js_match && js_match[1]) {
    return js_match[1];
  } 

  const md_pattern = /```([\s\S]+?)```/
  const md_match = api_output.match(md_pattern);

  if (md_match && md_match[1]) {
    return md_match[1];
  } 

  throw new Error('No markdown block found');
}

// Function that extracts the function name from a string
// Ex: "function foo(...)" returns "foo"
// Throws error when "javascript {function_name}(" is not found
function extractFunctionName(function_code: string): string {
  const function_pattern = /function (\w+)\s*\(/;
  const function_name = function_code.match(function_pattern);

  if (function_name && function_name[1]) {
    return function_name[1];
  } else {
    throw new Error('No function name found');
  }
}

// Generates an executable JavaScript Function from a string utilizing a llm
async function llmFunctionGeneration(user_input: string): Promise<Function> {
  const api_output = await callModelAPI(user_input);
  const js_code_block = parseMarkdown(api_output);
  const function_name = extractFunctionName(js_code_block);
  const function_input = `
      ${js_code_block}
      return ${function_name};
      `;

  return new Function(function_input)();
}

export { callModelAPI, parseMarkdown, extractFunctionName, llmFunctionGeneration }