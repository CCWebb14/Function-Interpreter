import { describe } from 'node:test';
import llmFunctionGeneration from './api_call'

function true_function(a: Array<number>, b: number) : number {
    for (let i: number = 0; i < a.length; i++) {
        if (a[i] == b) {
            return i;
        }
    }
    return -1;
}

async function run_test_cases(): Promise<string> {
    const user_input: string = 'it takes in an array and a number, returns the index where the number is matched in the array. if not present return -1';

    const llmGeneratedFunction: Function = await llmFunctionGeneration(user_input);

    console.log(llmGeneratedFunction.toString());
    const test_array1: Array<number> = [9, 2, 5, 8, 3, 6, 1];
    const test_search1: number = 2;
    const test_array2: Array<number> = [];
    const test_search2: number = 9;

    
    // In functions with multiple parameters, it will be necessary to test different arrangments for parameters
    // For example array as arg0, search as arg1 and vice versa
    // Maybe the user should specify the order? 
    console.log(llmGeneratedFunction(test_array1, test_search1));
    console.log(true_function(test_array1, test_search1))
    console.log(llmGeneratedFunction(test_array2, test_search2));
    console.log(true_function(test_array2, test_search2))

    return "stub";
}

run_test_cases();