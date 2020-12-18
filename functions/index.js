//firebase functions
const functions = require('firebase-functions');
//cors
const cors = require('cors')({origin: true});
//admin
const admin = require('firebase-admin');
//express
const express = require('express');
//auth
const auth = require('firebase-auth');
const { Query } = require('@google-cloud/firestore');
const { Console } = require('console');


admin.initializeApp({credential: admin.credential.cert(require('./admin.json'))});

const app = express(); //to access express
const db = admin.firestore(); //simplify access to firestore (the database)



app.get('/addworkout', (req,res) => {
    cors(req,res, () => {
        console.log("Adding Workout");
        //if user is signed in
        //add workout to users workout database
        //TODO: On signup user workout database should be created with email/username as name
        db.collection("userworkouts").doc("LCjsWI3T5Q12I5itezEZ")
        .get()
        .then((doc) => {
            let data = doc.data();
            console.log(data);
            
            return res.status(200).json({Movements: data.Workout, Repetitions: data.Repetitions, Sets: data.Sets});
        }).catch((error) => {
            console.log("error: ", error);
            return res.json(error);
        })
    });
});


app.get('/signup',(req,res) => {
    cors(req,res, () => {
        console.log("new user signup request made");
        admin
  .auth()
  .createUser({
    email: req.query.email,
    emailVerified: false,
    password: req.query.password,
    displayName: req.query.displayname,
    disabled: false,
  })
      

  
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    db.collection("users").doc(req.query.email).set({
        username: req.query.displayName,
        workouts: [],
        friends: []
    })
    console.log('Successfully created new user:', userRecord.uid);
    return res.json({message: "user created"});
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
    return res.json({message: error});
  });

  
    });
});

exports.api = functions.https.onRequest(app);




