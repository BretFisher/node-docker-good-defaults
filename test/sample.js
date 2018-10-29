const app = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe('API /healthz', () => {
    it('it should return 200', (done) => {
        chai.request(app)
            .get('/healthz')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('API /', () => {
    it('it should return Welcome message', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.to.be.html;
                res.text.should.be.equal("Hello Docker World\n");
                done();
            });
    });
});

describe('API /documents', () => {
    it('it should return an empty array', (done) => {
        chai.request(app)
            .get('/documents')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.to.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });
});
