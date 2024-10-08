
// Interface for a single test
// Input parameters and expected result
export interface Function_Test {
    parameters: any[];
    expected_result: any;
}

// Interface for a function suite (content associated to a single question)
export interface Function_Suite {
    function_string: string;
    tests: Function_Test[];
    test_count: number;
    hint: string;
}

// Map that associates a question id to a a function suite
// All questions are globally stored here
export const Function_Suite_Map: { [id: number]: Function_Suite } = {
    0: {
        // sum function 
        function_string: "function foo(a, b) {\n\treturn (a + b);\n}",
        tests: [
            { parameters: [1, 2], expected_result: 3 },
            { parameters: [0, 0], expected_result: 0 },
            { parameters: [-1, -3], expected_result: -4 },
            { parameters: [-2, 4], expected_result: 2 },
            { parameters: [1000000, 2000000], expected_result: 3000000 },
            { parameters: [1.5, 2.5], expected_result: 4.0 },
        ],
        test_count: 6,
        hint: "What operation is being performed?",
    },
    1: {
        // isEven function 
        function_string: "function boo(num) {\n\treturn num % 2 === 0;\n}",
        tests: [
            { parameters: [4], expected_result: true },
            { parameters: [5], expected_result: false },
            { parameters: [-6], expected_result: true },
            { parameters: [-7], expected_result: false },
            { parameters: [0], expected_result: true },
            { parameters: [2.2], expected_result: false },
        ],
        test_count: 6,
        hint: "What does a modulus operation returning 0 mean?",
    },
    2: {
        // max function 
        function_string: "function loo(a,b) {\n\treturn a >b ? a: b;\n}",
        tests: [
            { parameters: [1, 4], expected_result: 4 },
            { parameters: [Number.MAX_VALUE, 2], expected_result: Number.MAX_VALUE },
            { parameters: [-6, -2], expected_result: -2 },
            { parameters: [0, 2], expected_result: 2 },
            { parameters: [-3, 0], expected_result: 0 },
        ],
        test_count: 5,
        hint: "How does the question result impact the function’s subsequent output?",
    },
    3: {
        // firstInstance function 
        function_string: "function doo(arr,num) {\n\tfor (let i = 0; i < arr.length; i++) {\n\t\tif (arr[i] === num) {\n\t\t\treturn i;\n\t\t}\n\t}\n\treturn -1;\n}",
        tests: [
            { parameters: [[1, 2, 3, 4], 1], expected_result: 0 },
            { parameters: [[1, 1, 2, 3], 1], expected_result: 0 },
            { parameters: [[], 3], expected_result: -1 },
            { parameters: [[1, 3, 4, 5], 2], expected_result: -1 },
            { parameters: [[1, 2, 3, 3, 4, 3, 5], 3], expected_result: 2 },
        ],
        test_count: 5,
        hint: "What does indexOf return?",
    },
    4: {
        // countOccurrences function 
        function_string: "function coo(arr, num) {\n\tlet count = 0;\n\tfor (let i = 0; i < arr.length; i++) {\n\t\tif (arr[i] === num) {\n\t\t\tcount++;\n\t\t}\n\t}\n\treturn count;\n}",
        tests: [
            { parameters: [[1, 2, 3, 4], 1], expected_result: 1 },
            { parameters: [[1, 1, 2, 3], 5], expected_result: 0 },
            { parameters: [[], 3], expected_result: 0 },
            { parameters: [[1, 2, 3, 2, 1], 2], expected_result: 2 },
            { parameters: [[-2, 1, "a", 3, 4, "a", 3, 4, 4], 4], expected_result: 3 },
        ],
        test_count: 5,
        hint: "What makes count go up?"
    },
} 