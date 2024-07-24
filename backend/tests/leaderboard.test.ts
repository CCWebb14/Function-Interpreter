import app from "../app"

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app.ts')
describe("GET /api/attempts/top=10", () => {
    it('returns all attempts', (done) => {
        chai.request(app).get('/api/attempts/top-10').end((err, res) => {
            res.should.have.status(200);
            done();
        })
    })
})