import { expect } from 'chai';
import { Helper } from './helper.service';
import { baseConfig } from './../../../config';

describe('helper service', () => {
    let services;

    beforeEach((done) => {
        services = new Helper(baseConfig);
        done();
    });

    it('should get the expected json data', (done) => {
        expect(
            services.toJson('{"test": "test-data"}')
        ).to.eql({test: 'test-data'});

        done();
    });

    it('should get the expected string data', (done) => {
        expect(
            services.toString({test: 'test-data'})
        ).to.equal('{"test":"test-data"}');

        done();
    });

    it('should return a clean data object, array or string', (done) => {
        expect(
            services.cleanData('<script>')
        ).to.equal('script');

        expect(
            services.cleanData({test: '<script>'})
        ).to.eql({test: 'script'});

        expect(
            services.cleanData(['<script>'])
        ).to.eql(['script']);

        done();
    });

    it('should check if empty object and array', (done) => {
        expect(
            services.isEmptyObject({})
        ).to.be.true;

        expect(
            services.isEmptyObject({test: 'script'})
        ).to.be.false;

        done();
    });

    it('should check if string exists', (done) => {
        expect(
            services.stringExist('test', 'e')
        ).to.be.true;

        expect(
            services.stringExist('test', 'x')
        ).to.be.false;

        done();
    });

    it('should check if data is empty or not empty', (done) => {
        expect(
            services.isEmpty('')
        ).to.be.true;

        expect(
            services.isNotEmpty('x')
        ).to.be.true;

        done();
    });

    it('should check if valid email address', (done) => {
        expect(
            services.isEmail('test@supertest.com')
        ).to.be.true;

        expect(
            services.isEmail('xxxxxxx')
        ).to.be.false;

        done();
    });

    it('should check if data on array exists', (done) => {
        expect(
            services.validateData({test: 'test-data'}, ['test'])
        ).to.be.true;

        done();
    });

    it('should filter the data you want to show', (done) => {
        expect( services.filterData({test: 'test-data', test1: 'test-data'}, ['test']) ).to.eql({test: 'test-data'});

        done();
    });

    it('should remove the data you want to show', (done) => {
        expect( services.removeData({test: 'test-data', test1: 'test-data'}, ['test']) ).to.eql({test1: 'test-data'});

        done();
    });

    it('should replace html value', (done) => {
        expect( services.replaceHtml('http://www.test.com?k={{key}}', {'key': '12345'})).to.equal('http://www.test.com?k=12345');
        expect( services.replaceHtml('test-{{x}}-{{y}}-{{z}}', {'x': 'super', 'y': 'test'})).to.equal('test-super-test-{{z}}');

        done();
    });

    it('should check if string is in array', (done) => {
        expect( services.isInArray('x', ['x', 'z', 'y'])).to.be.true;
        expect( services.isInArray('x', ['xx', 'zz', 'yy'])).to.be.false;

        done();
    });

    it('should clean sequelize data', (done) => {
        expect( services.cleanSequelizeData({'data': 'data'})).to.eql({'data': 'data'});
        expect( services.cleanSequelizeDataArray([{'data': 'data'}])).to.eql([{'data': 'data'}]);

        done();
    });

    it('should check the password', (done) => {
        expect( services.getPassword('xxxxxx', 'saltbae')).to.equal('f0554e1d6fd6b4aa2a78a37f2299b27c605884b8335162ac66be37fa5b878e77');

        done();
    });

    it('should read and create jwt token', (done) => {
        const token = services.createJwtToken({'id': 'uuid-id'}, false);
        expect(token).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6InV1aWQtaWQifQ.aWM9UsKSx1ul4-KK2MmUK8-FwVs6bJDfFwFG-M3rKz8');
        expect(services.readJwtToken(token)).to.eql({'id': 'uuid-id'});

        done();
    });

    it('should generate random string', (done) => {
        expect( services.generateRandomString().length).to.equal(10);
        expect( services.generateRandomString('20').length).to.equal(20);

        done();
    });

    it('should check the user permission level', (done) => {
        expect( services.checkAccess({'permissionLevel': 2}, 2)).to.be.true;
        expect( services.checkAccess({'permissionLevel': 1})).to.be.true;
        expect( services.checkAccess({'permissionLevel': 2}, 1)).to.be.false;

        done();
    });

    it('should flat object', (done) => {
        expect( services.flatObject({
            'test1': 'one',
            'test2': {
                'test-inside1': 'one',
                'test-inside2': 'two',
                'test-x' : {
                    'xxxx': 'one'
                }
            }
        }) ).to.eql({
            'test1': 'one',
            'test-inside1': 'one',
            'test-inside2': 'two',
            'xxxx': 'one'
        });

        done();
    });

    it('should check expiry date', (done) => {
        expect( services.passwordExpiry).to.be.a('Date');

        done();
    });

    it('should get default configs', (done) => {
        expect( services.secretKey).to.be.a('string');
        expect( services.secretHash).to.be.a('string');
        expect( services.defaultUserRole).to.be.a('number');

        done();
    });
});

