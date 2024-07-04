import { Function_Suite_Map, Function_Test, Function_Suite } from "./function_suite";

export type test_results = {
    tests_passed : number;
    total_tests : number;
}

export const test_function = (llm_gen_function : Function, id : number) : test_results => {
    let pass_count : number = 0;
    let test_suite : Function_Suite = Function_Suite_Map[id];

    for (let i = 0; i < test_suite.test_count; i++) {
        const current_test : Function_Test = test_suite.tests[i];
        if (llm_gen_function(...(current_test.parameters)) == current_test.expected_result) {
            pass_count++;
        }
    }

    return {
        tests_passed: pass_count,
        total_tests: test_suite.test_count
    };
};