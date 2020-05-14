import { expect } from 'chai';
import { BaseInterface } from './base.interface';


describe('base interface', () => {
    let interfaces: any;

    before( (done) => {
        interfaces = new BaseInterface('sandbox');

        done();
    });

    it('should have the basic method', (done) => {
        expect(interfaces.middleWare).to.exist;
        expect(interfaces.middleWare).to.be.a('function');
        expect(interfaces.registerServices).to.exist;
        expect(interfaces.registerServices).to.be.a('function');

        done();
    });

    it('should get empty value', (done) => {
        expect(Object.keys(interfaces.services).length).to.equal(0);

        done();
    });
});
