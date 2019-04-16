const Koa = require('koa');
const KoaBody = require('koa-body');
const Xors = require('koa-cors');
const Work = require('./routes/Work');

const app = new Koa();

const MongoDBStorage = require('./core/Index').MongoDBStorage;

const Storage = new MongoDBStorage('mongodb://0.0.0.0:27017/');

Storage.Seed('ProductionDocument', 'EW').then(() => {}).catch(() => {});

app.use(Xors());

app.use(KoaBody());

app.use(Work.routes());

app.listen(3030);