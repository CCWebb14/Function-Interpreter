import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';

chai.use(chaiHttp);

describe('Dashboard API Endpoint Tests', () => {
    it('should return user statistics', (done) => {
        chai.request('http://localhost:4001')
        .get('/api/users/dashboard')
        .end((err: any, res: any) => { 
            if (err) done(err);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
        });
    });
});