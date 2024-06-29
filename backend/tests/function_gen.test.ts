import { callOpenAiApi, parseMarkdown, extractFunctionName, llmFunctionGeneration } from '../function_gen'
import * as chai from 'chai';
import {expect} from 'chai';
import chaiAsPromised  from 'chai-as-promised';
import { describe, it } from 'mocha';

chai.use(chaiAsPromised);

describe('#parseMarkdown', () => {
    it('empty string = ERROR', () => {
        const empty_string : string = '';
        expect(() => parseMarkdown(empty_string)).to.throw(Error, 'No javascript markdown block found');
    })

    it('incomplete js block = ERROR', () => {
        const incomplete_js : string = '```javascript\n foo bar ';
        expect(() => parseMarkdown(incomplete_js)).to.throw(Error, 'No javascript markdown block found');
    })

    it('foo function', () => {
        const js_block_other_lines : string = 'foo\n bar\n ```javascript\nfoo\nbar```';
        expect(parseMarkdown(js_block_other_lines)).to.eql('foo\nbar');
    })
})

describe('#extractFunctionName', () => {
    it('empty string', () => {
        const empty_string : string = '';
        expect(() => extractFunctionName(empty_string)).to.throw(Error, 'No function name found');
    })

    it('function foo', () => {
        const foo_function : string = 'function foo';
        expect(() => extractFunctionName(foo_function)).to.throw(Error, 'No function name found');
    })

    it('function foo()', () => {
        const foo_function : string = 'function foo()';
        expect(extractFunctionName(foo_function)).to.eql('foo');
    })

    it('function foo(a)', () => {
        const foo_function : string = 'function foo(a)';
        expect(extractFunctionName(foo_function)).to.eql('foo');
    })

    it('function foo(a, b)', () => {
        const foo_function : string = 'function foo(a, b)';
        expect(extractFunctionName(foo_function)).to.eql('foo');
    })
})

describe('#callOpenAiApi', () => {
    it('javascript syntax', () => {
        const js_syntax : string = 'function foo(a,b) {\n return a + b\;\n}';
        expect(callOpenAiApi(js_syntax)).to.eventually.include("ERROR");
    })

    it('proper request', () => {
        const proper_request: string = 'This function takes in two parameters and returns them added together.';
        expect(callOpenAiApi(proper_request)).to.eventually.include("function" && "return");
    })
})

// Gloval variables for llm generated functions
let generated_func : Function;
let llm_user_msg : string;

describe('LLM Generated Function: addition', () => {
    before(async () => {
        llm_user_msg = 'This function takes in two parameters and returns them added together.';
        generated_func = await llmFunctionGeneration(llm_user_msg);
    });

    it('(1,2) = 3', () => {
        expect(generated_func(1, 2)).to.eql(3);
    })

    it('(0,0) = 0', () => {
        expect(generated_func(0, 0)).to.eql(0);
    })

    it('(100,100) = 200', () => {
        expect(generated_func(100, 100)).to.eql(200);
    })
})

describe('LLM Generated Function: array search', () => {
    before(async () => {
        llm_user_msg = `This function takes in an array and a number, is searches the array for 
            the number. If it finds it return the index, otherwise return -1.`;
        generated_func = await llmFunctionGeneration(llm_user_msg);
    });

    const test_array: Array<number> = [9, 11, 12, 4, 8];

    it('([9, 11, 12, 4, 8], 9) = 0', () => {
        expect(generated_func(test_array, 9)).to.eql(0);
    })

    it('([9, 11, 12, 4, 8], 8) = 4', () => {
        expect(generated_func(test_array, 8)).to.eql(4);
    })

    it('([9, 11, 12, 4, 8], 11) = 1', () => {
        expect(generated_func(test_array, 11)).to.eql(1);
    })

    it('([9, 11, 12, 4, 8], 21) = -1', () => {
        expect(generated_func(test_array, 21)).to.eql(-1);
    })
})

describe('LLM Generated Function: recursive sum', () => {
    before(async () => {
        llm_user_msg = `This function takes in a number, subtracts one from itself and intrinsicly
         calls itself and adds the result. The base case is less than or equal to 0 return 0.`;
        generated_func = await llmFunctionGeneration(llm_user_msg);
    });

    it('(0) = 0', () => {
        expect(generated_func(0)).to.eql(0);
    })

    it('(-1) = 0', () => {
        expect(generated_func(-1)).to.eql(0);
    })

    it('(1) = 1', () => {
        expect(generated_func(1)).to.eql(1);
    })

    it('(5) = 15', () => {
        expect(generated_func(5)).to.eql(15);
    })

    it('(100) = 55', () => {
        expect(generated_func(10)).to.eql(55);
    })
})

describe('LLM Generated Function: irrelevent user message = ERROR', () => {
    it('irrelevent message: how many pounds in a ton?', () => {
        const msg : string = 'How many pounds in a ton?';
        expect(callOpenAiApi(msg)).to.eventually.throw(Error,
             'An error occurred while generating the llm function');
    })
})