const expect = require('chai').expect;
const Storage = require('../../server/core/Index').MongoDBStorage;
const Url = 'mongodb://0.0.0.0:27017/';

describe('STORAGE', () => {
    describe('MONGO DB', () => {
        it('Should Seed Data', async () => {
            const DB = new Storage(Url);

            await DB.Seed('TEST_COLLECTION', 'TEST_DB');
        });

        it('Should Get Data', async () => {
            const DB = new Storage(Url);

            const result = await DB.Get({ workId: 'AVV' }, 'TEST_COLLECTION', 'TEST_DB');

            expect(result.length).to.be.greaterThan(0);
        });

        it('Should Insert an Element', async () => {
            const DB = new Storage(Url);

            await DB.Insert([{ workId: 'TEST', toWorks: [{'length':200,'type':'outAvv'}]}], 'TEST_COLLECTION', 'TEST_DB');
        });

        it('Should Delete an Element', async () => {
            const DB = new Storage(Url);

            await DB.DeleteOne({ workId: 'TEST' }, 'TEST_COLLECTION', 'TEST_DB');
        });
    });
});