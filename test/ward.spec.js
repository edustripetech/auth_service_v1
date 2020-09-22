import chai, { expect } from 'chai';
import faker from 'faker';
import chaiHttp from 'chai-http';
import server from '../index';

chai.use(chaiHttp);
chai.should();

const userTypes = [
  'Student_Guardian',
  'School_Admin',
  'School_Staff',
  'School_Student',
];

const gender = [
  'male',
  'female',
  'other',
];
const baseAPIUrl = '/api/v1';
const wardBaseUrl = `${baseAPIUrl}/wards`;
let auth;

before((done) => {
  const newUser = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userType: faker.random.arrayElement(userTypes),
    password: '1234567890dy&%$#',
  };
  chai
    .request(server)
    .post(`${baseAPIUrl}/auth/sign-up`)
    .send(newUser)
    .end((error, response) => {
      auth = response.header.authorization;
      done();
    });
});

/**
   * @name newWard
   * @returns {Object} a new ward object
   */
const newWard = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  avatar: faker.image.avatar(),
  gender: faker.random.arrayElement(gender),
  schoolId: faker.random.uuid(),
});

describe('Create Ward Test', () => {
  const ward = newWard();
  context('When a parent request for a ward to be added', () => {
    it('adds the ward and associates the ward to the parent', (done) => {
      chai
        .request(server)
        .post(`${wardBaseUrl}/create`)
        .set('Authorization', auth)
        .send(ward)
        .end((error, response) => {
          const { status, body: { data = {} }, body } = response || {};
          expect(status).to.equal(201);
          expect(body).to.have.keys(['code', 'message', 'data']);
          expect(data.firstName).to.equal(ward.firstName);
          done();
        });
    });
  });

  context('When a request with duplicate data is made', () => {
    it('throws an error', (done) => {
      chai
        .request(server)
        .post(`${wardBaseUrl}/create`)
        .set('Authorization', auth)
        .send(ward)
        .end((error, response) => {
          const { status, body: { error: errorObject = {} }, body } = response || {};
          expect(status).to.equal(500);
          expect(body).to.have.keys(['code', 'message', 'error']);
          expect(errorObject.code).to.equal(409);
          expect(errorObject.message).to.equal('Ward already exist');
          done();
        });
    });
  });

  context('When avatar data is missing', () => {
    const ward1 = newWard();
    delete ward1.avatar;
    it('creates ward', (done) => {
      chai
        .request(server)
        .post(`${wardBaseUrl}/create`)
        .set('Authorization', auth)
        .send(ward1)
        .end((error, response) => {
          const { status, body: { data = {} }, body } = response || {};
          expect(status).to.equal(201);
          expect(body).to.have.keys(['code', 'message', 'data']);
          expect(data.firstName).to.equal(ward1.firstName);
          done();
        });
    });
  });

  context('When no data is sent', () => {
    it('throws an error', (done) => {
      chai
        .request(server)
        .post(`${wardBaseUrl}/create`)
        .set('Authorization', auth)
        .end((error, response) => {
          const { status, body } = response || {};
          expect(status).to.equal(500);
          expect(body).to.have.keys(['code', 'message', 'error']);
          done();
        });
    });
  });
});
