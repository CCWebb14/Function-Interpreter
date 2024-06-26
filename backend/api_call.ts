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

async function callOpenAiApi(user_input: string): Promise<SuccessfulResponse> {
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
    return data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error with the Axios request:', error.response?.data);
      throw new Error('Failed to call OpenAI API');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

function parseMarkdown(api_output: string): string {
    const js_pattern = /```javascript\n([^`]+)```/;
    const match = api_output.match(js_pattern);

    if (match && match[1]) {
        return match[1];
    } else {
        console.log("No match found");
        throw new Error('An unexpected error occurred');
    }
}



async function main() {
    try {
      const user_input: string = 'it takes a number and returns that number times 25';
      const api_output = await callOpenAiApi(user_input);
      const parsed_markdown = parseMarkdown(api_output.choices[0].message.content);
      console.log(parsed_markdown);
    } catch (error) {
      console.error('An error occurred:', (error as Error).message);
    }
}

// Call the API function
main();
