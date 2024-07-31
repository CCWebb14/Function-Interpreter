import { expect } from 'chai';
import axios from 'axios';

// Define the test suite for hint functionality
export function runHintTests() {
  const baseUrl = 'http://localhost:4001/api/test';

  describe('Hint Functionality API', function () {
    const attemptsApiUrl = `${baseUrl}/attempts`;

    it('should register an attempt with hint used', async function () {
      const attempt = {
        userID: 3,
        questionID: 2,
        score: 8,
        maxScore: 10,
        timeTaken: 120,
        hintUsed: true,
      };

      try {
        const response = await axios.post(attemptsApiUrl, attempt);
        expect(response.status).to.equal(201);
        expect(response.data).to.have.property('success', true);
        expect(response.data).to.have.property('message', 'Attempt registered successfully');
      } catch (error: any) {
        console.error('Error response:', error.response ? error.response.data : error.message);
        throw new Error(`Failed to register attempt with hint: ${error.response ? error.response.data.message : error.message}`);
      }
    });

    it('should register an attempt without hint used', async function () {
      const attempt = {
        userID: 3,
        questionID: 2,
        score: 9,
        maxScore: 10,
        timeTaken: 100,
        hintUsed: false,
      };

      try {
        const response = await axios.post(attemptsApiUrl, attempt);
        expect(response.status).to.equal(201);
        expect(response.data).to.have.property('success', true);
        expect(response.data).to.have.property('message', 'Attempt registered successfully');
      } catch (error: any) {
        console.error('Error response:', error.response ? error.response.data : error.message);
        throw new Error(`Failed to register attempt without hint: ${error.response ? error.response.data.message : error.message}`);
      }
    });

  });
}