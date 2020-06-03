import { expect } from 'chai';
import { CoreMiddleware } from './core.middleware';


describe('core middleware', () => {
    let middlewares: any;

    before( (done) => {
        middlewares = new CoreMiddleware('sandbox');

        done();
    });

    it('should have the basic method', (done) => {
        expect(middlewares.all).to.exist;
        expect(middlewares.all).to.be.a('function');
        expect(middlewares.get).to.exist;
        expect(middlewares.get).to.be.a('function');
        expect(middlewares.post).to.exist;
        expect(middlewares.post).to.be.a('function');
        expect(middlewares.put).to.exist;
        expect(middlewares.put).to.be.a('function');
        expect(middlewares.delete).to.exist;
        expect(middlewares.delete).to.be.a('function');

        expect(middlewares.cacheCheck).to.exist;
        expect(middlewares.cacheCheck).to.be.a('function');

        done();
    });

    it('should get empty value', (done) => {
        expect(middlewares.getInclude().length).to.equal(0);
        expect(middlewares.postInclude().length).to.equal(0);
        expect(middlewares.attributes.length).to.equal(0);
        expect(middlewares.requiredParameters.length).to.equal(0);

        done();
    });

    it('should get autofill value', (done) => {
        expect(middlewares.autoFillPostInformation({'dataOne': 'test'}, {})).to.include({'dataOne': 'test'});
        expect(middlewares.autoFillPostInformation({'dataOne': 'test'}, {'id': '1'})).to.include({'dataOne': 'test', 'createdUserId': '1', 'updatedUserId': '1'});

        expect(middlewares.autoFillPutInformation({'dataOne': 'test'}, {})).to.include({'dataOne': 'test'});
        expect(middlewares.autoFillPutInformation({'dataOne': 'test'}, {'id': '1'})).to.include({'dataOne': 'test', 'updatedUserId': '1'});

        done();
    });
});
