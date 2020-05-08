import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

chai.use(chaiHttp);
chai.should();

const baseAPIUrl = '/api/v1';

describe('Server Indexes', () => {
  it('Should display HTML content on hitting base route', async () => {
    const response = await chai
      .request(server)
      .get('/');
    expect(response).to.have.status(200);
    expect(response.text).contains('Welcome to Edustripe authentication service!');
  });

  it('Should return json response on hitting base api route', (done) => {
    chai
      .request(server)
      .get(`${baseAPIUrl}/`)
      .end((error, response) => {
        const { body } = response;
        response.should.have.status(200);
        body.should.be.a('object');
        body.should.have.property('code');
        body.code.should.equal(200);
        body.should.have.property('message');
        body.message.should.equal('Welcome to Edustripe authentication service!');
        done();
      });
  });

  it('Should return 404 error on hitting a route that does not exits', (done) => {
    chai
      .request(server)
      .get(`${baseAPIUrl}/does-not-exists`)
      .end((error, response) => {
        const { body } = response;
        response.should.have.status(404);
        body.code.should.equal(404);
        body.message.should.equal(
          'Requested resource not found!',
        );
        done();
      });
  });
});
