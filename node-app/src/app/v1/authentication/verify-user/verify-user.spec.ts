import * as supertest from 'supertest';
import { expect } from 'chai';

import app from '../../../../app';

describe('verify user component', () => {
	it('should not be allowed to verify', (done) => {
		supertest(app)
			.post('/v1/auth/verify?test=true')
			.set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
			.send({
				username: 'spiderman',
				verificationKey: 'random-key',
			})
			.expect('Content-Type', /json/)
			.expect(400, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('failed');

				done();
			});
	});

	it('should send verification email', (done) => {
		supertest(app)
			.post('/v1/auth/verifysend?test=true')
			.set('x-node-api-key', 'S3VRbXZueFhFalI3S1h3ZnVjZ2VyVGY2WXdaVjVBbXo1YXd3eGY1UEZna3BHcmIzSm4=')
			.send({
				username: 'spiderman',
				return: 'https://wwww.jnpl.me/verify?p={{key}}',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('string');

				done();
			});
	});
});
