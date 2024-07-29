import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';

chai.use(chaiHttp);

describe('API Endpoint Tests', () => {
  it('should return top 10 attempts', (done) => {
    chai.request('http://localhost:4001')
      .get('/api/attempts/top-10')
      .end((err:any, res:any) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.most(10);
        done();
      });
  });
});