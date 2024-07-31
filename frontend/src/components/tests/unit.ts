import { expect } from 'chai';
import axios from 'axios';

// Define the test suite
export function runTests() {

    //For sessions
    let cookie: string
    // API Endpoints
    const mockApi = 'http://localhost:4001/api/test';
    const userApi = 'http://localhost:4001/api/users';
    const attemptsApi = 'http://localhost:4001/api/attempts';
    const questionApi = 'http://localhost:4001/api/question';


    describe('Database Operations [CRUD]', function () {
        it('should create a test table', async function () {
            const response = await axios.get(`${mockApi}/create-test-table`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test table created successfully.');
        });

        it('should insert test data into the table', async function () {
            const response = await axios.post(`${mockApi}/insert-test-data`, { name: 'Test User' });
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test data inserted successfully.');
        });

        it('should query test data from the table', async function () {
            const response = await axios.get(`${mockApi}/query-test-data`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result.data).to.be.an('array');
            expect(result.data).to.have.lengthOf(1);
            expect(result.data[0]).to.have.property('name', 'Test User');
        });

        it('should update test data in the table', async function () {
            const queryResponse = await axios.get(`${mockApi}/query-test-data`);
            const user = queryResponse.data.data[0];
            const updateResponse = await axios.put(`${mockApi}/update-test-data/${user.id}`, { name: 'Updated User' });
            expect(updateResponse.data).to.have.property('success', true);
            expect(updateResponse.data).to.have.property('message', 'Test data updated successfully.');
        });

        it('should delete test data from the table', async function () {
            const queryResponse = await axios.get(`${mockApi}/query-test-data`);
            const user = queryResponse.data.data[0];
            const deleteResponse = await axios.delete(`${mockApi}/delete-test-data/${user.id}`);
            expect(deleteResponse.data).to.have.property('success', true);
            expect(deleteResponse.data).to.have.property('message', 'Test data deleted successfully.');
        });

        it('should drop the test table', async function () {
            const response = await axios.delete(`${mockApi}/drop-test-table`);
            const result = response.data;
            expect(result).to.have.property('success', true);
            expect(result).to.have.property('message', 'Test table dropped successfully.');
        });
    });

    describe('User Registration API', function () {

        it('should register a new user successfully', async function () {
            const newUser = {
                username: 'mockuser1',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'mockuser@example.com',
            };

            try {
                const response = await axios.post(`${userApi}/register`, newUser);
                expect(response.status).to.equal(201);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('message', 'User created successfully');
            } catch (error: any) {
                throw new Error(`Failed to register new user: ${error.response ? error.response.data.message : error.message}`);
            }
        });

        it('should not allow duplicate usernames', async function () {
            const duplicateUser = {
                username: 'mockuser2',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'mockuser2@example.com',
            };

            try {
                await axios.post(`${userApi}/register`, duplicateUser);
            } catch (error: any) {
                expect(error.response.status).to.equal(400);
                expect(error.response.data).to.have.property('message', 'Username already taken');

            }
        });

        it('should not allow duplicate emails', async function () {
            const duplicateUser = {
                username: 'mockuser3',
                password: 'password123',
                firstName: '',
                lastName: '',
                email: 'mockuser2@example.com',
            };

            try {
                await axios.post(`${userApi}/register`, duplicateUser);
            } catch (error: any) {
                try {
                    expect(error.response.status).to.equal(401);
                    expect(error.response.data).to.have.property('message', 'Email already taken');
                } catch (assertionError) {
                    throw new Error(`Expected status 401 and message 'Email already taken', but got status ${error.response.status} and message '${error.response.data.message}'`);
                }
            }
        });
    });

    describe('Login API', function () {

        it('should succesfully log user in with the right credentials', async function () {
            const credentials = {
                username: 'mockuser1',
                password: 'password123',
            };

            try {
                const response = await axios.post(`${userApi}/login`, credentials, {
                    withCredentials: true, // Allow cookies to be set and sent in subsequent requests
                });

                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('user');
                expect(response.data.user).to.have.property('username', 'mockuser1');
                cookie = response.headers['set-cookie']?.[0] || '';

            } catch (error: any) {
                throw new Error(`Failed to log in: ${error.response ? error.response.data.message : error.message}`);
            }
        });
    });

    describe('User Dashboard API', function () {

        it('should contain user statistics', async function () {
            try {
                const response = await axios.get(`${userApi}/dashboard`);
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('userName');
                expect(response.data).to.have.property('totalTime');
                expect(response.data).to.have.property('attemptedQuestions');
                expect(response.data).to.have.property('passedQuestions');
            } catch (error: any) {
                throw new Error(`Failed to log in: ${error.response ? error.response.data.message : error.message}`);

            }
        });
    });


    describe('Hint Functionality API', function () {
        const attemptsApiUrl = `${mockApi}/attempts`;

        it('should register an attempt with hint used', async function () {
            const attempt = {
                userID: 1,
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
                userID: 1,
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
                    const response = await axios.post(`${questionApi}/submit/0`, submission);
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
                    const response = await axios.get(`${questionApi}/list`);
                    expect(response.status).to.equal(200);
                    expect(response.data).to.have.property('success', true);
                    expect(response.data).to.have.property('message');
                } catch (error: any) {
                    throw new Error(`Failed to get question list: ${error.response ? error.response.data.message : error.message}`);
                }
            });

            it('should get a specific question by ID', async function () {
                try {
                    const response = await axios.get(`${questionApi}/id/1`);
                    expect(response.status).to.equal(200);
                    expect(response.data).to.have.property('success', true);
                    expect(response.data).to.have.property('function_string', 'function boo(num) {\n\treturn num % 2 === 0;\n}');
                    expect(response.data).to.have.property('hint');
                } catch (error: any) {
                    throw new Error(`Failed to get question by ID: ${error.response ? error.response.data.message : error.message}`);
                }
            });
        });

    });


    describe('Leaderboard DB Test', function () {
        it('Check response contains correct properties', async function () {
            try {
                const response = await axios.get(`${attemptsApi}/top-ten`);
                const result = response.data.message;
                console.log('here: ', result)
                expect(result[0]).to.have.property('userID');
                expect(result[0]).to.have.property('username');
                expect(result[0]).to.have.property('totalScore');
            } catch (error: any) {
                throw new Error(`Wrong data response: ${error.response ? error.response.data.message : error.message}`);
            }
        });

        it('Check Leaderboard max 10 entries', async function () {
            try {
                const response = await axios.get(`${attemptsApi}/top-ten`);
                const result = response.data.message;
                expect(result).to.have.lengthOf.at.most(10);
            } catch (error: any) {
                throw new Error(`Wrong data response: ${error.response ? error.response.data.message : error.message}`);
            }
        });

        it('Check Leaderboard in ascending order', async function () {
            try {
                const response = await axios.get(`${attemptsApi}/top-ten`);
                const result = response.data.message;

                let prev = Infinity
                let isAsc = true
                for (const { totalScore } of result) {
                    console.log(totalScore, ' <= ', prev)
                    if (totalScore > prev) {
                        isAsc = false
                    }
                    prev = totalScore;
                }
                expect(isAsc).to.equal(true)
            } catch (error: any) {
                throw new Error(`Wrong ranking order: ${error.response ? error.response.data.message : error.message}`);
            }
        });
    });


    describe('Logout api test', function () {
        it('should successfully log user out', async function () {
            try {
                const response = await axios.post(`${userApi}/logout`, {}, {
                    headers: {
                        Cookie: cookie, // Send the session cookie to authenticate the logout request
                    },
                    withCredentials: true,
                });
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('message', 'Logged out successfully');
            } catch (error: any) {
                throw new Error(`Failed to log out: ${error.response ? error.response.data.message : error.message}`);

            }
        });


        it('should not allow access to protected route after logout', async function () {
            try {
                await axios.get(`${attemptsApi}/top-ten`, {
                    headers: {
                        Cookie: cookie, // Send the session cookie to authenticate the request
                    },
                    withCredentials: true,
                });
                throw new Error('Should not have access to the protected route');
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response) {
                    expect(error.response.status).to.equal(401);
                    expect(error.response.data).to.have.property('success', false);
                    expect(error.response.data).to.have.property('message', 'Not authenticated');
                } else {
                    throw new Error(`Attempting to get leaderboard: ${error.message}`);
                }
            }
        });


    });



}