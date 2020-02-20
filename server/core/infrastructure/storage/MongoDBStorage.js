const abstractions = require('../../../../lib/abstraction/Index');

const MongoClient = require('mongodb').MongoClient;

class MongoDBStorage extends abstractions.IStorage {

    constructor(conn_string){
        super();

        this.conn_string = conn_string;
    }

    Seed(collection, database){
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.conn_string, { useNewUrlParser: true }, function(err, db) {
                if (err) reject(err);
                var dbo = db.db(database);
                dbo.createCollection(collection, function(err, res) {
                    if (err) reject(err);
                    db.close();
                    resolve();
                });
            });
        });
    }

    Get(query, collection, database){
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.conn_string, { useNewUrlParser: true },  function(err, db) {
                if (err) reject(err);
                var dbo = db.db(database);
                dbo.collection(collection).find(query).toArray(function(err, result) {
                    if (err) reject(err);
                    db.close();
                    resolve(result);
                });
            });
        });
    }

    DeleteOne(query, collection, database){
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.conn_string, { useNewUrlParser: true },  function(err, db) {
                if (err) reject(err);
                var dbo = db.db(database);
                dbo.collection(collection).deleteOne(query, function(err, result) {
                    if (err) reject(err);
                    db.close();
                    resolve();
                });
            });
        });
    }

    Insert(obj, collection, database){
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.conn_string, { useNewUrlParser: true }, function(err, db) {
                if (err) reject(err);
                var dbo = db.db(database);
                dbo.collection(collection).insertMany(obj, function(err, res) {
                    if (err) reject(err);
                    db.close();
                    resolve();
                });
            });
        });
    }
}

module.exports = MongoDBStorage;