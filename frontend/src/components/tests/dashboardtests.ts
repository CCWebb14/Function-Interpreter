import { expect } from 'chai';
import axios from 'axios';


export function runDashboardTests() { 

    const apiUrl = 'http://localhost:4001/api/users/';

    describe('Dashboard Functionality API', function () {
        
        it('should contain user statistics', async function () {
                const response = await axios.get(`${apiUrl}/dashboard`);
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property('success', true);
                expect(response.data).to.have.property('userName');
                expect(response.data).to.have.property('totalTime');
                expect(response.data).to.have.property('attemptedQuestions');
                expect(response.data).to.have.property('passedQuestions');
        });
    });

}