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

const baseAPIUrl = '/api/v1';
const profileBaseUrl = `${baseAPIUrl}/profiles`;
let token, user;

before(() => {
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
      token = response.header.authorization;
      user = response.body.data;
    });
});

/**
   * @name newWard
   * @returns {Object} a new ward object
   */
const newProfileData = () => ({
  bio: faker.lorem.paragraphs(),
  avatar: faker.image.avatar(),
  parentId: faker.random.uuid(),
});

describe('Edit Profile Test', () => {
  context('When a user request for is detail to be updated', () => {
    it('updates only the editable fields', (done) => {
      const profile = newProfileData();
      chai
        .request(server)
        .post(`${profileBaseUrl}/edit`)
        .set('Authorization', token)
        .send(profile)
        .end((error, response) => {
          const { status, body: { data = {} }, body } = response || {};
          expect(status).to.equal(200);
          expect(body).to.have.keys(['code', 'message', 'data']);
          expect(data.bio).to.equal(profile.bio);
          expect(data.parentId).not.to.equal(profile.parentId);
          done();
        });
    });
  });

  context('When a wrong data type is sent', () => {
    it('throws an error', (done) => {
      chai
        .request(server)
        .post(`${profileBaseUrl}/edit`)
        .set('Authorization', token)
        .send({ bio: [] })
        .end((error, response) => {
          const { status, body } = response || {};
          expect(status).to.equal(500);
          expect(body).to.have.keys(['code', 'message', 'error']);
          done();
        });
    });
  });
});
