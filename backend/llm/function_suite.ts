

export interface Function_Test {
    parameters: any[];
    expected_result: any;
}

export interface Function_Suite {
    function_string: string;
    tests: Function_Test[];
    test_count: number;
}

export const Function_Suite_Map: {[id: number]: Function_Suite} = {
    0: {
        function_string: "function foo(a, b) {\nreturn (a + b);\n}",
        tests: [
            { parameters: [1, 2], expected_result: 3 },
            { parameters: [0, 0], expected_result: 0 },
            { parameters: [5, 5], expected_result: 10 },
            { parameters: [20, 35], expected_result: 55 },
            { parameters: [100, 100], expected_result: 200 },
        ],
        test_count: 5, 
    },
}