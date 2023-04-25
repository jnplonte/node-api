import { Op } from 'sequelize';

import { expect } from 'chai';
import { Query } from './query.service';
import { baseConfig } from './../../../config';

import { setup } from './../../../models';

describe('query service', () => {
	let services;
	let models;

	const getfinalData = function (data) {
		data = typeof data.get !== 'undefined' ? data.get({ plain: true }) : data;

		const finalData: Object = { data: data.data || [], pagination: data.pagination || {} };

		return finalData['data'];
	};

	const cleanfinalData = function (data) {
		return typeof data.get !== 'undefined' ? data.get({ plain: true }) : data;
	};

	beforeEach((done) => {
		services = new Query(baseConfig);
		models = setup();

		done();
	});

	it('should check if models exists', (done) => {
		expect(models.users).to.exist;
		expect(models.users.findAll).to.exist;
		expect(models.users.findAll).to.be.a('function');
		expect(models.users.findOne).to.exist;
		expect(models.users.findOne).to.be.a('function');
		expect(models.users.create).to.exist;
		expect(models.users.create).to.be.a('function');
		expect(models.users.update).to.exist;
		expect(models.users.update).to.be.a('function');
		expect(models.users.destroy).to.exist;
		expect(models.users.destroy).to.be.a('function');

		done();
	});

	it('should mock get all data', (done) => {
		services
			.getAll(models.users, {})
			.then((data) => {
				expect(getfinalData(data)).to.have.lengthOf.above(1);

				done();
			})
			.catch(done);
	});

	it('should mock get all data with limit', (done) => {
		services
			.getAll(models.users, {}, { limit: 1 })
			.then((data) => {
				expect(getfinalData(data)).to.have.lengthOf(1);

				done();
			})
			.catch(done);
	});

	it('should get one data', (done) => {
		services
			.getOne(models.users, {
				where: { id: 'da744a7e-c058-4082-ba3e-d52f36293698' },
			})
			.then((data) => {
				expect(cleanfinalData(data)).to.have.property('id');

				done();
			})
			.catch(done);
	});

	it('should get the query request', (done) => {
		expect(services.appendRequestQuery({}, 'ENName:LTL|TCName:XXX')).to.have.eql({
			ENName: { [Op.like]: '%LTL%' },
			TCName: { [Op.like]: '%XXX%' },
		});

		done();
	});
});
