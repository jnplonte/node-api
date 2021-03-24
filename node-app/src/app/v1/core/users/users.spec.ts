import * as supertest from 'supertest';
import { expect } from 'chai';

import app from './../../../../app';
import { Users } from './users.component';

import { Helper } from './../../../../app/services/helper/helper.service';
import { baseConfig } from './../../../../config';

const authKey: string =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImRhNzQ0YTdlLWMwNTgtNDA4Mi1iYTNlLWQ1MmYzNjI5MzY5OCIsInVzZXJuYW1lIjoic3VwZXJBZG1pbiIsImZpcnN0TmFtZSI6IlN1cGVyIiwibGFzdE5hbWUiOiJBZG1pbiIsInJvbGVJZCI6MSwibG9naW5Db3VudCI6MCwicGVybWlzc2lvbkxldmVsIjoxfQ.IsTx_7ru52zlzk8af1mcSUh2Atsnv677dumVbnRptpU';
let testName: number = 1;

const timeStamp: number = new Date().getTime();
describe('users component', () => {
	let application: any;

	before((done) => {
		application = new Users('sandbox', null, null, new Helper(baseConfig), null);

		done();
	});

	it('should have the basic method', (done) => {
		expect(application.autoFillPostInformation).to.exist;
		expect(application.autoFillPostInformation).to.be.a('function');
		expect(application.autoFillPutInformation).to.exist;
		expect(application.autoFillPutInformation).to.be.a('function');
		expect(application.postInclude).to.exist;
		expect(application.postInclude).to.be.a('function');

		done();
	});

	it('should fetch post and put information', (done) => {
		const data: Object = {
			firstName: 'test',
		};
		const dataPassword: Object = {
			firstName: 'test',
			password: 'password',
		};

		const auth: Object = {
			id: 'abc',
		};

		expect(application.autoFillPostInformation(dataPassword, auth)).to.contain.keys(
			'salt',
			'password',
			'passwordExpiry',
			'roleId'
		);

		expect(application.autoFillPutInformation(data, auth)).to.eql({
			firstName: 'test',
			updatedUserId: 'abc',
		});
		expect(application.autoFillPutInformation(dataPassword, auth)).to.contain.keys(
			'salt',
			'password',
			'passwordExpiry'
		);

		done();
	});

	it('should get all user', (done) => {
		supertest(app)
			.get('/v1/core/users?test=true')
			.set('Authorization', `Bearer ${authKey}`)
			.expect('Content-Type', /json/)
			.expect(200, (err, res) => {
				if (err) {
					return done(err);
				}

				expect(res.body.status).to.equal('success');
				expect(res.body.data).to.be.a('Array');
				expect(res.body.data).to.have.lengthOf.above(1);

				done();
			});
	});

	it('should create user', (done) => {
		supertest(app)
			.post('/v1/core/user?test=true')
			.set('Authorization', `Bearer ${authKey}`)
			.send({
				firstName: 'test',
				lastName: 'test',
				email: `test${timeStamp}@email.com`,
				username: `test${timeStamp}`,
				password: '5f4dcc3b5aa765d61d8327deb882cf99',
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

	it('should get user', (done) => {
		supertest(app)
			.get(`/v1/core/user/${testName}?test=true`)
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

	it('should update user', (done) => {
		supertest(app)
			.put(`/v1/core/user/${testName}?test=true`)
			.set('Authorization', `Bearer ${authKey}`)
			.send({
				firstName: 'test-update',
				lastName: 'test-update',
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

	it('should delete user', (done) => {
		supertest(app)
			.delete(`/v1/core/user/${testName}?test=true`)
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
