const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;

class BackEndMain {
    constructor() {
        this.databaseConnection = new DatabaseConnection();
        databaseConnection.init();
    }
}


class DatabaseConnection {
    constructor() {
        this.mongo = {
            db: null,
            connectionURL: 'mongodb://127.0.0.1:27017',
            databaseName: 'UofA-Hours',
        }
    }

    init() {
        // Initialize Mongo
        MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
            if (error) {
                return console.log("Unable to connect to database.");
            }
            
            this.db = client.db(databaseName);
        });
    }    


    // Getter methods
    getProfessor(professor) {
        let professor_document;
        db.collection('office_hours').findOne({
            "professor": professor
        }).then((result) => {
            // Add the class
            professor_document = result;
        }).catch((error) => {
            console.log("Error: " + error);
        });
        return professor_document;
    }


    // Insert methods
    insertNewProfessor(professor) {
        db.collection('office_hours').insertOne({
            "professor": professor,
            "classes" : {}
         }).then((result) => {
            console.log("Success!");
         }).catch((error) => {
            console.log("Error: " + error);
         });
    }

    insertNewClass(professor, class_name) {
        // Get professor's document
        let professor_document = this.getProfessor(professor);
        professor_document

        
        db.collection('office_hours').insertOne({
            "professor": professor,
            "classes" : {}
         }).then((result) => {
            console.log("Success!");
         }).catch((error) => {
            console.log("Error: " + error);
         });
    }

    insertNewOfficeHour(professor, class_name, startTime, endTime) {

    }
}






