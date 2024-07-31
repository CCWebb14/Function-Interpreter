import { expect } from 'chai';
import axios from 'axios';
import 'mocha/mocha.js';

// Define the test suite
export function runAdditionalTests() {
  const apiUrl = 'http://localhost:4001/api/question';

  describe('LLM Functionality API', function () {
    it('should submit user function and return test results', async function () {
        // timeout extension for llm responses
        this.timeout(60000);

      const submission = {
        user_input: 'return the sum of two numbers',
        time: 120,
        hint_used: true,
      };

      try {
        const response = await axios.post(`${apiUrl}/submit/0`, submission);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('success', true);
        expect(response.data).to.have.property('tests_passed', 6);
        expect(response.data).to.have.property('total_tests', 6);
        expect(response.data).to.have.property('llm_function');
      } catch (error: any) {
        throw new Error(`Failed to submit user function: ${error.response ? error.response.data.message : error.message}`);
      }
    });
  })

  describe('Question API', function () {
    it('should get the list of questions', async function () {
      try {
        const response = await axios.get(`${apiUrl}/list`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('success', true);
        expect(response.data).to.have.property('message');
      } catch (error: any) {
        throw new Error(`Failed to get question list: ${error.response ? error.response.data.message : error.message}`);
      }
    });

    it('should get a specific question by ID', async function () {
      try {
        const response = await axios.get(`${apiUrl}/id/1`);
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('success', true);
        expect(response.data).to.have.property('function_string', 'function boo(num) {\n\treturn num % 2 === 0;\n}');
        expect(response.data).to.have.property('hint');
      } catch (error: any) {
        throw new Error(`Failed to get question by ID: ${error.response ? error.response.data.message : error.message}`);
      }
    });
  });
}
