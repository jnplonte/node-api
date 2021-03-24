import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';

const authKey: string =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImRhNzQ0YTdlLWMwNTgtNDA4Mi1iYTNlLWQ1MmYzNjI5MzY5OCIsInVzZXJuYW1lIjoic3VwZXJBZG1pbiIsImZpcnN0TmFtZSI6IlN1cGVyIiwibGFzdE5hbWUiOiJBZG1pbiIsInJvbGVJZCI6MSwibG9naW5Db3VudCI6MCwicGVybWlzc2lvbkxldmVsIjoxfQ.IsTx_7ru52zlzk8af1mcSUh2Atsnv677dumVbnRptpU';
let testName: number = 0;

describe('languages component', () => {
	it('should get all language', (done) => {
		supertest(app)
			.get('/v1/core/languages?test=true')
			.set('Authorization', `Bearer ${authKey}`)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('Array');

				done();
			});
	});

	it('should create language', (done) => {
		supertest(app)
			.post('/v1/core/language?test=true')
			.set('Authorization', `Bearer ${authKey}`)
			.send({
				name: 'language-test',
				code: 'ct',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				testName = res.body.data || 0;
				expect(res.body.status).to.equal('success');

				done();
			});
	});

	it('should get language', (done) => {
		supertest(app)
			.get(`/v1/core/language/${testName}?test=true`)
			.set('Authorization', `Bearer ${authKey}`)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('Object');

				done();
			});
	});

	it('should update language', (done) => {
		supertest(app)
			.put(`/v1/core/language/${testName}?test=true`)
			.set('Authorization', `Bearer ${authKey}`)
			.send({
				name: 'language-test-update',
			})
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');

				done();
			});
	});

	it('should delete language', (done) => {
		supertest(app)
			.delete(`/v1/core/language/${testName}?test=true`)
			.set('Authorization', `Bearer ${authKey}`)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');

				done();
			});
	});
});
