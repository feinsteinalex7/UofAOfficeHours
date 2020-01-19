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
            /*this.databaseConnection.insertNewProfessor("test3").then((result) => {
                this.databaseConnection.insertNewClass("test3", "woo").then((result) => {
                    this.databaseConnection.insertNewOfficeHour("test3", "woo", "2AM-10PM", "test loc").then((result) => {
                        this.databaseConnection.getProfessor("test3").then((result2) => {
                            console.log(result2);
                        }).catch((error) => {console.log(error)});
                    }).catch((error) => {console.log(error)});
                });
            }).catch((error) => {console.log(error)});*/
        }).catch((error) => {console.log(error)});
    }
}

class WebServer {
    constructor() {
        this.backEnd = new BackEndMain();
        this.app = express();
        this.port = process.env.PORT || 3000;
    }

    init() {
        this.app.use(express.static(path.join(__dirname, '../public')));
        var search_results = [];
        this.app.get('/search', (req, res) => {
            if (typeof req.query.term === "undefined" || req.query.term == "") {
                return;
            }
            console.log("reeee", this.backEnd);
            console.log("search term: ", req.query.term);
            console.log(search_results);

            this.backEnd.databaseConnection.mongo.db.collection('office_hours').find({
                $or: [
                {classes: req.query.term},
                {profS: {$regex: req.query.term.toLowerCase()}}
                ]
            }).toArray(function(error, result) {
                console.log("hello", result);
                let relevant_obj = [];
                if (typeof result[0] === "undefined") {
                    res.send([]);
                    return;
                }
                if (result[0].classes.includes(req.query.term)) {
                    for(let i = 0; i < result.length; i++) {
                        relevant_obj.push({
                            _id: result[i]._id,
                            professor: decodeURI(result[i].professor),
                            classes: decodeURI([req.query.term]),
                            hours: result[i].hours,
                            loc: decodeURI(result[i].loc)
                        });
                    }
                    console.log("rev", relevant_obj);
                    res.send(relevant_obj);
                }
                else 
                {
                    let r = result
                    for (let i = 0; i < result.length; i++) {
                        r[i].professor = decodeURI(r[i].professor);
                        r[i].loc = decodeURI(r[i].loc);
                        
                        for (let j = 0; j < r[i].classes.length; j++) {
                            r[i].classes[j] = decodeURI(r[i].classes[j]);
                        }
                    }
                    res.send(result);
                }
            });
        });

        this.app.get('/entry', (req, res) => {
            req.query

            this.backEnd.databaseConnection.insertNewProfessor(req.query.profName).then((result) =>{
                this.backEnd.databaseConnection.insertNewClass(req.query.profName, req.query.className).then((result) => {
                    var office_hours = [];
                    for (let i = 0; i < 100; i++) {
                        let s = req.query["officeHour" + i];
                        console.log("asdfasefasefasef", req.query);
                        if (s == '') {
                            continue;
                        }
                        if (typeof s === "undefined") {
                            break;
                        }
                        office_hours.push(decodeURI(s));
                    }
                    console.log("asduf  uasief  ", office_hours);
                    this.backEnd.databaseConnection.insertNewOfficeHour(req.query.profName, req.query.className, office_hours, req.query.locName).then((result) => {
                        res.send();
                    });
                }).catch((error) => {console.log(error)});
            }).catch((error) => {console.log(error)});
        });

        this.app.listen(this.port, () => {
            console.log("Server is up on port " + this.port);
        });
    }
}


class DatabaseConnection {
    constructor() {
        this.mongo = {
            db: null,
            connectionURL: 'mongodb+srv://hackaztest:hackaztest@uofa-hours-0pir6.mongodb.net/test',
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
                "profS": professor.toLowerCase()
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
            this.getProfessor(professor).then((result) => {
                if (result === "error" || result == null) {
                    this.mongo.db.collection('office_hours').insertOne({
                        "professor": professor,
                        "profS": professor.toLowerCase(),
                        "classes" : [],
                        "hours": [],
                        "loc": ""
                    }).then((result) => {
                        resolve();
                        console.log("Success!");
                    }).catch((error) => {
                        reject(error);
                        console.log("Error: " + error);
                    });
                }
                else
                {
                    console.log("professor already has entry");
                    resolve();
                }
            }).catch((error) => {
                console.log(error);
                reject();
            });
        });
    }

    insertNewClass(professor, class_name) {
        return new Promise((resolve, reject) => {
            // Get professor's document
            let professor_document = null;
            this.getProfessor(professor).then((result) => {
                if (!result.classes.includes(class_name))
                {
                    professor_document = result;
                    var classList = professor_document.classes;
                    console.log(classList);
                    classList.push(class_name);
                    console.log(classList);

                    this.mongo.db.collection("office_hours").updateOne({
                        _id: professor_document._id
                    }, {
                        $set:
                        {
                            classes: classList
                        }
                    }).then((result) => {
                        console.log("Successfully inserted class");
                        console.log(professor_document);
                        console.log("----------");
                        this.getProfessor("test").then((result) => {
                            console.log(result);
                            console.log("//////////");
                        });
                        resolve(professor_document);
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                    });
                }
                else {
                    console.log("class already exists for professor");
                    resolve(result);
                }
            }).catch((error) => {
                console.log(error);
            });
        });
    }

    insertNewOfficeHour(professor, class_name, time, location) {
        return new Promise((resolve, reject) => {
            // Get professor's document
            let professor_document = null;
            this.getProfessor(professor).then((result) => {
                //console.log("res", result);
                professor_document = result;
                var hours = professor_document.hours;
                if (typeof hours === "undefined") {
                    hours = [];
                }

                if (typeof time != "string") {
                    if (typeof hours[professor_document.classes.indexOf(class_name)] == "undefined") {
                        hours[professor_document.classes.indexOf(class_name)] = [];
                    }
                    hours[professor_document.classes.indexOf(class_name)] = hours[professor_document.classes.indexOf(class_name)].concat(time);
                    console.log("auisdbfliuasgeufiaw", hours, "siugfialsf ", time);
                    this.mongo.db.collection("office_hours").updateOne({
                        _id: professor_document._id
                    }, {
                        $set:
                        {
                            hours: hours,
                            loc: location
                        }
                    }).then((result) => {
                        console.log("Successfully inserted hours");
                        console.log(professor_document);
                        console.log("++++++++++");
                        resolve(professor_document);
                        return;
                    }).catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
                    return;
                }

                if (typeof hours[professor_document.classes.indexOf(class_name)] === "undefined") {
                    console.log("WWWWWWW ", hours);
                    hours[professor_document.classes.indexOf(class_name)] = [];
                }
                if (!hours[professor_document.classes.indexOf(class_name)].includes(time)) {
                    hours[professor_document.classes.indexOf(class_name)].push(time);
                }
                this.mongo.db.collection("office_hours").updateOne({
                    _id: professor_document._id
                }, {
                    $set:
                    {
                        hours: hours,
                        loc: location
                    }
                }).then((result) => {
                    console.log("Successfully inserted hours");
                    console.log(professor_document);
                    console.log("++++++++++");
                    resolve(professor_document);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            });
        });
    }
}

var backend = null;
new Promise((resolve, reject) => {
    backend = new WebServer();
    resolve(backend);
}).then((result) => {backend.init();});