
import { Function_Suite_Map, Function_Test, Function_Suite } from "./function_suite";

// Type definition for test_results
export type test_results = {
    tests_passed: number;
    total_tests: number;
    cases: test_case[];
}

// Type definition for a single test case result
type test_case = {
    testID: number; 
    input : any;
    expected_output : any;
    output : any;
    pass : boolean
};

// Initial state for a single test case
const initialState: test_case = {
    testID: 0,
    input: "",
    expected_output: "",
    output: "",
    pass: false,
};

// Function that handles the testing the llm generated function against a test suite
// Returns the number of tests_passed, total_tests in the suite and an array of each test case
export const test_function = (llm_gen_function: Function, id: number): test_results => {
    let tests_passed: number = 0;
    let test_suite: Function_Suite = Function_Suite_Map[id];
    let cases: test_case[] = [];


    // Loop that iterates through each test in the suite and executes the test
    // Pushes test case to the cases array
    for (let i = 0; i < test_suite.test_count; i++) {
        const current_test: Function_Test = test_suite.tests[i];
        let cur_case: test_case= {...initialState};
        cur_case.testID = i;
        cur_case.input = current_test.parameters;
        cur_case.expected_output = current_test.expected_result;

        try {
            let result: any = llm_gen_function(...current_test.parameters);
            cur_case.output = result;

            if (result == current_test.expected_result) {
                cur_case.pass = true;
                tests_passed++;
            } 
        } catch (error) {
            // The llm generated function encountered an error
            // Continue with further tests
            cur_case.output = "function encountered error";
        } finally {
            cases.push(cur_case);
        }
    }

    return {
        tests_passed,
        total_tests: test_suite.test_count,
        cases
    };
};