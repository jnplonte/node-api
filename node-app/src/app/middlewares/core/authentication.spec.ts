import { expect } from 'chai';
import { AuthenticationMiddleware } from './authentication.middleware';

describe('authentication middleware', () => {
	let middlewares: any;

	before((done) => {
		middlewares = new AuthenticationMiddleware('sandbox');

		done();
	});

	it('should get autofill value', (done) => {
		expect(middlewares.autoFillPostInformation({ dataOne: 'test' }, {})).to.include({ dataOne: 'test' });

		done();
	});
});
