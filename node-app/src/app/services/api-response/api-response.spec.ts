import { expect } from 'chai';
import { ApiResponse } from './api-response.service';

describe('api response service', () => {
    let services;

    beforeEach( (done) => {
        services = new ApiResponse();

        done();
    });

    it('should get the correct message', (done) => {
        expect(services.getMessage('put-success')).to.equal('Update Success');
        expect(services.getMessage('post-success')).to.equal('Insert Success');
        expect(services.getMessage('delete-success')).to.equal('Delete Success');

        expect(services.getMessage('put-failed')).to.equal('Update Failed');
        expect(services.getMessage('post-failed')).to.equal('Insert Failed');
        expect(services.getMessage('delete-failed')).to.equal('Delete Failed');

        expect(services.getMessage('data-failed')).to.equal('Missing Parameters');
        expect(services.getMessage('token-failed')).to.equal('Invalid Authentication Token');
        expect(services.getMessage('model-failed')).to.equal('Internal Server Error');
        expect(services.getMessage('login-failed')).to.equal('Invalid Username or Password');

        done();
    });

    it('should get the error message', (done) => {
        expect(services.getError('SequelizeDatabaseError')).to.equal('Database Error');
        expect(services.getError('NetworkingError')).to.equal('Network Error');

        done();
    });

    it('should get the success payload', (done) => {
        expect(services.success({}, 'post', 'test-data').status).to.equal('success');
        expect(services.success({}, 'put', 'test-data', {'count': 1}).status).to.equal('success');
        expect(services.success({}, 'get', 'test-data', {'count': 1}).pagination).to.eql({'count': 1});

        done();
    });

    it('should get the failed payload', (done) => {
        expect(services.failed({}, 'post', 'test-data').status).to.equal('failed');
        expect(services.failed({}, 'get', 'test-data', 401).status).to.equal('failed');

        done();
    });
});
