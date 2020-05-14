import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';

const timeStamp: number = new Date().getTime();
describe('register component', () => {
    it('should not be allowed to register user', (done) => {
        supertest(app).post('/v1/auth/register?test=true')
            .set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
            .send({
                'firstName': 'test',
                'lastName': 'test'
            })
            .expect('Content-Type', /json/)
            .expect(400, (err, res) => {
                if (err) { return done(err); }

                expect(res.body.status).to.equal('failed');

                done();
            });
    });

    it('should register user', (done) => {
        supertest(app).post('/v1/auth/register?test=true')
            .set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
            .send({
                'companyKey': 'MWYzOTE0MGMtYjdjMC00ZWFlLWJhYWItYjE1NDA1ZTAxZTRh',
                'firstName': 'test',
                'lastName': 'test',
                'email': `test${timeStamp}@email.com`,
                'username': `test${timeStamp}`,
                'password': '5f4dcc3b5aa765d61d8327deb882cf99',
                'roleId': 5,
                'verified': true
            })
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                if (err) { return done(err); }

                expect(res.body.status).to.equal('success');
                expect(res.body.data).to.be.a('string');

                done();
            });
    });

    it('should key register user', (done) => {
        supertest(app).post('/v1/auth/keyregister?test=true')
            .set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
            .send({
                'companyKey': 'MWYzOTE0MGMtYjdjMC00ZWFlLWJhYWItYjE1NDA1ZTAxZTRh',
                'firstName': 'test',
                'lastName': 'test',
                'email': `test${timeStamp}@email.com`,
                'username': `test${timeStamp}`,
                'password': '5f4dcc3b5aa765d61d8327deb882cf99',
                'roleId': 5,
                'verified': true,
                'socialMedia': 'FACEBOOK',
                'socialMediaKey': '12345678910'
            })
            .expect('Content-Type', /json/)
            .expect(200, (err, res) => {
                if (err) { return done(err); }

                expect(res.body.status).to.equal('success');
                expect(res.body.data).to.be.a('string');

                done();
            });
    });
});
