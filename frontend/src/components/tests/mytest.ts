import { expect } from 'chai';
import axios from 'axios';


// Sample function to test
export function add(a: number, b: number): number {
    return a + b;
}

// Define the test suite
export function runTests() {

    // apiLinks
    const apiUrl = 'http://localhost:4001/api/test';
    const apiUrl2 = 'http://localhost:4001/api/users';
    const apiUrl3 = 'http://localhost:4001/api/attempts';

    describe('User Registration API', function () {

        it('should register a new user successfully', async function () {
            const newUser = {
                username: 'newuser',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'newuser@example.com',
            };

            try {
                const response = await axios.post(`${apiUrl2}/register`, newUser);
                expect(response.status).to.equal(201);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('message', 'User created successfully');
            } catch (error: any) {
                throw new Error(`Failed to register new user: ${error.response ? error.response.data.message : error.message}`);
            }
        });

        it('should not allow duplicate usernames', async function () {
            const duplicateUser = {
                username: 'newuser',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'newuser2@example.com',
            };

            try {
                await axios.post(`${apiUrl2}/register`, duplicateUser);
            } catch (error: any) {
                expect(error.response.status).to.equal(400);
                expect(error.response.data).to.have.property('message', 'Username already taken');

            }
        });

        it('should not allow duplicate emails', async function () {
            const duplicateUser = {
                username: 'anotherusers',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'newuser2@example.com',
            };

            try {
                await axios.post(`${apiUrl2}/register`, duplicateUser);
            } catch (error: any) {
                try {
                    expect(error.response.status).to.equal(401);
                    expect(error.response.data).to.have.property('message', 'Email already taken');
                } catch (assertionError) {
                    throw new Error(`Expected status 401 and message 'Email already taken', but got status ${error.response.status} and message '${error.response.data.message}'`);
                }
            }
        });

        it('should allow overlapping details but different username and email', async function () {
            const newUser = {
                username: 'anotheruser',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'anotheruser@example.com',
            };

            try {
                const response = await axios.post(`${apiUrl2}/register`, newUser);
                expect(response.status).to.equal(201);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('message', 'User created successfully');
            } catch (error: any) {
                throw new Error(`Failed to register new user: ${error.response ? error.response.data.message : error.message}`);
            }
        });
    });

    describe('User Login and Logout API', function () {

        it('should succesfully log user in with the right credentials', async function () {
            const credentials = {
                username: 'newuser',
                password: 'password123',
            };

            try {
                const response = await axios.post(`${apiUrl2}/login`, credentials);
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('user');
                expect(response.data.user).to.have.property('username', 'newuser');
            } catch (error: any) {
                throw new Error(`Failed to log in: ${error.response ? error.response.data.message : error.message}`);
            }
        });
    });


    describe('Database Operations [CRUD]', function () {
        it('should create a test table', async function () {
            const response = await axios.get(`${apiUrl}/create-test-table`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test table created successfully.');
        });

        it('should insert test data into the table', async function () {
            const response = await axios.post(`${apiUrl}/insert-test-data`, { name: 'Test User' });
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test data inserted successfully.');
        });

        it('should query test data from the table', async function () {
            const response = await axios.get(`${apiUrl}/query-test-data`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result.data).to.be.an('array');
            expect(result.data).to.have.lengthOf(1);
            expect(result.data[0]).to.have.property('name', 'Test User');
        });

        it('should update test data in the table', async function () {
            const queryResponse = await axios.get(`${apiUrl}/query-test-data`);
            const user = queryResponse.data.data[0];
            const updateResponse = await axios.put(`${apiUrl}/update-test-data/${user.id}`, { name: 'Updated User' });
            expect(updateResponse.data).to.have.property('success', true);
            expect(updateResponse.data).to.have.property('message', 'Test data updated successfully.');
        });

        it('should delete test data from the table', async function () {
            const queryResponse = await axios.get(`${apiUrl}/query-test-data`);
            const user = queryResponse.data.data[0];
            const deleteResponse = await axios.delete(`${apiUrl}/delete-test-data/${user.id}`);
            expect(deleteResponse.data).to.have.property('success', true);
            expect(deleteResponse.data).to.have.property('message', 'Test data deleted successfully.');
        });

        it('should drop the test table', async function () {
            const response = await axios.delete(`${apiUrl}/drop-test-table`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test table dropped successfully.');
        });
    });

    describe('Leaderboard DB Test', function () {
        it('Check response contains correct properties', async function () {
            const response = await axios.get(`${apiUrl3}/top-ten`);
            const result = response.data.message;
            expect(result[0]).to.have.property('userID');
            expect(result[0]).to.have.property('username');
            expect(result[0]).to.have.property('totalScore');
        });
        it('Check Leaderboard max 10 entries', async function () {
            const response = await axios.get(`${apiUrl3}/top-ten`);
            const result = response.data.message;
            expect(result).to.have.lengthOf.at.most(10);
        });
        it('Check Leaderboard in ascending order', async function () {
            const response = await axios.get(`${apiUrl3}/top-ten`);
            const result = response.data.message;
            
            let prev = Infinity
            let isAsc = true
            for (const {totalScore} of result) {
                if (totalScore > prev) {
                  isAsc = false
                }
                prev = totalScore;
            }
            expect(isAsc).to.equal(true)
        });
      });


}