import { expect } from 'chai';
import { BaseMiddleware } from './base.middleware';


describe('base middleware', () => {
    let middlewares: any;

    before( (done) => {
        middlewares = new BaseMiddleware('sandbox');

        done();
    });

    it('should have the basic method', (done) => {
        expect(middlewares.middleWare).to.exist;
        expect(middlewares.middleWare).to.be.a('function');
        expect(middlewares.registerServices).to.exist;
        expect(middlewares.registerServices).to.be.a('function');

        done();
    });

    it('should get empty value', (done) => {
        expect(Object.keys(middlewares.services).length).to.equal(0);

        done();
    });
});
