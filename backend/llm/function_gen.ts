import axios from 'axios';

type SuccessfulResponse = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason: string;
  context: number[];
  total_duration: number,
  load_duration: number,
  prompt_eval_count: number,
  prompt_eval_duration: number,
  eval_count: number,
  eval_duration: number
};

async function callOpenAiApi(user_input: string): Promise<string> {
  const url: string = 'http://ollama:11434/api/generate';

  try {
    const response = await axios.post<SuccessfulResponse>(url, {
      model: 'llama3',
      stream: false,
      system: 'Your job is to take a plain english interpretation of a function and return a single javascript block.',
      prompt: user_input
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Failed to call ollama API');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

function parseMarkdown(api_output: string): string {
  const js_pattern = /```([\s\S]+?)```/;
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
  const api_output = await callOpenAiApi(user_input);
  const js_code_block = parseMarkdown(api_output);
  const function_name = extractFunctionName(js_code_block);
  const function_input = `
      ${js_code_block}
      return ${function_name};
      `;

  // May want to run later in a vm due to security concerns
  return new Function(function_input)();
}

export { callOpenAiApi, parseMarkdown, extractFunctionName, llmFunctionGeneration }