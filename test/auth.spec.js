import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import server from '../index';

chai.use(chaiHttp);
chai.should();

const baseAPIUrl = '/api/v1';

describe('Authentication tests', () => {
  let token;
  const userTypes = [
    'Student_Guardian',
    'School_Admin',
    'School_Staff',
    'School_Student',
  ];
  const newUser = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userType: faker.random.arrayElement(userTypes),
    password: '1234567890dy&%$#',
  };
  /**
   * @name authExpectations
   * @param {Number} code
   * @param {String} message
   * @param {Function} done
   * @returns {function(...[*]=)} Expectation callback
   */
  const authExpectations = (code, message, done) => (err, response) => {
    token = null;
    if (err) {
      return done(err);
    }
    expect(response.status).to.equal(code);
    expect(response.body).to.have.keys(['code', 'message', 'data']);
    expect(response.body.message).to.be.equals(message);
    expect(response.body.data).to.be.an('object');
    expect(response.body.data.id).to.be.a('string');
    expect(response.body.data.firstName).to.equal(newUser.firstName);
    expect(response.header.authorization).to.contain('Bearer');
    expect(response.header['x-refresh-token']).to.contain('Bearer');
    token = response.header.authorization;
    [, token] = (token || '').split(' ');
    expect(token).to.be.not.equal(null);
    newUser.id = response.body.data.id;
    done();
  };

  it('Should create a new user and return a 201 with Authorization header set', (done) => {
    chai
      .request(server)
      .post(`${baseAPIUrl}/auth/sign-up`)
      .send(newUser)
      .end(authExpectations(201, 'New resource has been created', done));
  });

  it('Should log in a registered user', (done) => {
    chai
      .request(server)
      .post(`${baseAPIUrl}/auth/sign-in`)
      .send({ email: newUser.email, password: newUser.password })
      .end(authExpectations(200, 'Ok', done));
  });
});
