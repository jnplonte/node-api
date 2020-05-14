import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';

describe('forgot password component', () => {
    it('should not be allowed to change user password', (done) => {
        supertest(app).post('/v1/auth/forgot?test=true')
            .set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
            .send({
                'forgotPasswordKey': 'random-key',
                'password': '5f4dcc3b5aa765d61d8327deb882cf99'
            })
            .expect('Content-Type', /json/)
            .expect(400, (err, res) => {
                if (err) { return done(err); }

                expect(res.body.status).to.equal('failed');

                done();
            });
    });

    it('should forgot user password', (done) => {
        supertest(app).post('/v1/auth/forgotsend?test=true')
            .set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
            .send({
                'username': 'spiderman',
                'return': 'https://wwww.jnpl.me/forgot?p={{key}}'
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
