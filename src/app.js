const mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const MongoClient = mongodb.MongoClient;

const path = require('path');
const express = require('express');



class BackEndMain {
    constructor() {
        this.databaseConnection = new DatabaseConnection();
        console.log("db made");
        this.databaseConnection.init().then((result) => {
            this.databaseConnection.insertNewProfessor("test").then((result) => {
                this.databaseConnection.getProfessor("test").then((result2) => {
                    console.log(result2);
                });
            });
            this.databaseConnection.insertNewClass("test", "lol").then((result) => {
                this.databaseConnection.getProfessor("test").then((result) => {
                    console.log(result);
                })
            });
        });
    }
}

class WebServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
    }

    init() {
        this.app.use(express.static(path.join(__dirname, '../public')));

        this.app.get('', (req, res) => {
            res.send("test");
        });

        this.app.listen(this.port, () => {
            console.log("Server is up on port " + port);
        });
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
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.mongo.connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
                if (error) {
                    reject(error);
                    console.log("Unable to connect to database.");
                } else {
                    this.mongo.db = client.db(this.mongo.databaseName);
                    resolve(this.mongo.db);
                }
            });
        });
    }    


    // Getter methods
    getProfessor(professor) {
        let professor_document = null;
        return new Promise((resolve, reject) => {
            this.mongo.db.collection('office_hours').findOne({
                "professor": professor
            }).then((res) => {
                // Add the class
                if (res == null) {
                    professor_document = "error";
                }
                professor_document = res;
                resolve(professor_document);
            }).catch((error) => {
                professor_document = "error";
                reject(error);
                console.log("Error: " + error);
            });
        });
    }


    // Insert methods
    insertNewProfessor(professor) {
        return new Promise((resolve, reject) => {
            this.mongo.db.collection('office_hours').insertOne({
                "professor": professor,
                "classes" : [],
                "hours": []
            }).then((result) => {
                resolve();
                console.log("Success!");
            }).catch((error) => {
                reject(error);
                console.log("Error: " + error);
            });
        });
    }

    insertNewClass(professor, class_name) {
        // Get professor's document
        let professor_document = null;
        this.getProfessor(professor).then((result) => {
            professor_document = result;
            var classList = professor_document.classes;
            console.log(classList);
            console.log(professor_document);
            classList.push(class_name);
            console.log(classList);

            let updatePromise = new Promise((resolve, reject) => {
                this.mongo.db.collection("office_hours").updateOne({
                    _id: professor_document._id
                }, {
                    $set:
                    {
                        classes: this.classList
                    }
                }).then((result) => {resolve()});
            });

            updatePromise.then((result) => {
                console.log("Successfully inserted class");
                resolve();
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    insertNewOfficeHour(professor, class_name, startTime, endTime) {

    }
}

let backend = new BackEndMain();
