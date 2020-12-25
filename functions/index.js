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

app.post('/addworkout', (req,res) => {
  //TODO: Make sure user is authenticated
  db.collection("userworkouts").doc()
  .set({
    uid: "8bdIe4HOfoSCEG6j7osKFgcttI02",
    name: "2 Minuite Workout",
    moves: ["burpees", "lunges", "pushups"],
    reps: [3,2,1],
    sets: [2,3,2]
  })
  return res.status(200).json({status: 300});
  
});



app.get('/getworkouts', (req,res) => {
    cors(req,res, () => {
        // console.log("Adding Workout");
        //if user is signed in
        //add workout to users workout database
        //TODO: Authenticate User uid = uid 
        //TODO: On signup user workout database should be created with email/username as name
        let userworkouts = db.collection("userworkouts");
        let query = userworkouts.where("uid", "==", req.query.uid);
        let result;
        query
        .get()
        .then(function(querySnapshot) {
          result = [];
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            result.push([doc.id , doc.data()]);
        });
        return res.json({data: result});
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    
    });
  });



app.get('/test', (req,res) => {
  cors(req,res, () => {
    return res.json({workouts: ["pushups", "squats", "crunches"]});
  })
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
    db.collection("users").doc(userRecord.uid).set({
      workouts: ["day 1", "day 2", "day 3"]
    }).catch((error) => {
      console.log(error);
    })
    return res.json({message: "user created"});
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
    return res.json({message: error});
  });

  
    });
});

exports.api = functions.https.onRequest(app);




