const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'UofA-Hours';

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database.");
    }
    
    const db = client.db(databaseName);

    /*
    db.collection('users').insertOne({
       name: 'Alex',
       age: 20 
    }, (error, result) => {
        if (error) {
            return console.log("Unable to insert user");
        }

        console.log(result.ops);
    });
    
    const updatePromise = db.collection("users").updateOne({
        _id: new ObjectID("5e1ba82a3f49ee0f31f3376d")
    }, {
        $inc: {
            age: 1
        }
    });

    updatePromise.then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });

    db.collection("tasks").updateMany({
        completed: false
    }, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
    */
    
    /*
    db.collection("users").deleteMany({
        age: 20
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }); 
    */

    db.collection("tasks").deleteOne({
        _id: new ObjectID("5e1bcdedcfe951119fe6be7a")
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }); 


    /*
    db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 28
        },
        {
            name: 'Gunther',
            age: 27
        }
    ], (error, result) => {
        if (error) {
            return console.log("Unable to insert documents!");
        }
        console.log(result.ops);
    });
    */

    /*
    db.collection('tasks').insertMany([
        {
            name: "task 1",
            description: "the easiest task",
            completed: true
        },
        {
            name: "task 2",
            description: "the medium task",
            completed: false
        },
        {
            name: "task 3",
            description: "the hardest task",
            completed: true
        }
    ], (error, result) => {
        if (error) {
            return console.log("Unable to insert these documents!");
        }
        console.log(result.ops);
    });
    */

    /*
    db.collection('users').findOne({name: 'Jen'}, (error, user) => {
        if (error) {
            return console.log("Unable to fetch.");
        }
        console.log(user);
    });

    db.collection('users').find({age: 27}).toArray((error, users) => {
        console.log(users);
    });
    */

    /*
    db.collection('tasks').findOne({_id: new ObjectID("5e1bcdedcfe951119fe6be78")}, (error, doc) => {
        if (error) {
            return console.log("findOne error!");
        }
        console.log("findOne", doc);
    });

    db.collection('tasks').find({completed: true}).toArray((error, docs) => {
        if (error) {
            return console.log("find error!");
        }
        console.log("find", docs);
    });
    */



});

