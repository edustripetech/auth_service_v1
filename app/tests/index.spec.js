import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.should();
chai.use(chaiHttp);

describe('API Base test', () => {
  it('should hit the API base route', (done) => {
    chai.request(app)
      .get('/')
      .end((_, res) => {
        res.status.should.equal(200);
        done();
      });
  });
});
