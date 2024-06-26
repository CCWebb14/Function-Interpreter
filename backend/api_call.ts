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

async function callOpenAiApi(): Promise<SuccessfulResponse> {
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
          content: 'it takes a number and returns that number times 25'
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

async function main() {
    try {
      const response = await callOpenAiApi();
      console.log(response.choices[0].message.content);
    } catch (error) {
      console.error('An error occurred:', (error as Error).message);
    }
}

// Call the API function
main();
