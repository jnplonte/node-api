import { expect } from 'chai';
import { CoreInterface } from './core.interface';


describe('core interface', () => {
    let interfaces: any;

    before( (done) => {
        interfaces = new CoreInterface('sandbox');

        done();
    });

    it('should have the basic method', (done) => {
        expect(interfaces.all).to.exist;
        expect(interfaces.all).to.be.a('function');
        expect(interfaces.get).to.exist;
        expect(interfaces.get).to.be.a('function');
        expect(interfaces.post).to.exist;
        expect(interfaces.post).to.be.a('function');
        expect(interfaces.put).to.exist;
        expect(interfaces.put).to.be.a('function');
        expect(interfaces.delete).to.exist;
        expect(interfaces.delete).to.be.a('function');

        expect(interfaces.cacheCheck).to.exist;
        expect(interfaces.cacheCheck).to.be.a('function');

        done();
    });

    it('should get empty value', (done) => {
        expect(interfaces.getInclude().length).to.equal(0);
        expect(interfaces.postInclude().length).to.equal(0);
        expect(interfaces.attributes.length).to.equal(0);
        expect(interfaces.requiredParameters.length).to.equal(0);

        done();
    });

    it('should get autofill value', (done) => {
        expect(interfaces.autoFillPostInformation({'dataOne': 'test'}, {})).to.include({'dataOne': 'test'});
        expect(interfaces.autoFillPostInformation({'dataOne': 'test'}, {'id': '1'})).to.include({'dataOne': 'test', 'createdUserId': '1', 'updatedUserId': '1'});

        expect(interfaces.autoFillPutInformation({'dataOne': 'test'}, {})).to.include({'dataOne': 'test'});
        expect(interfaces.autoFillPutInformation({'dataOne': 'test'}, {'id': '1'})).to.include({'dataOne': 'test', 'updatedUserId': '1'});

        done();
    });
});
