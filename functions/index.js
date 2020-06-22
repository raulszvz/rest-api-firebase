const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();


let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sweetjazmin-api.firebaseio.com"
});

const db = admin.firestore();
app.use(cors({origin:true}));

//Example
app.get('/', (req, res) => {
    return res.status(200).send('Hello World');
});

/* CRUD OPERATIONS */

//Create 
app.post('/api/create/:collection', (req,res) =>{
    (async () =>{
        try{
            await db.collection(req.params.collection).doc('/'+req.body.id + '/')
            .create(req.body)
            console.log(req.body.name);
            return res.status(200).send(req.body.name);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

 
//Read
app.get('/api/read/:collection/:id',(req, res) => {
    (async () => {
        try{
            const document = db.collection(req.params.collection).doc(req.params.id);
            let doc = await document.get();
            let response = doc.data();
            return res.status(200).send(response);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read All
app.get('/api/read/:collection',(req, res) => {
    (async () => {
        try{
            let query = db.collection(req.params.collection);
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs){
                    const selectedItem = doc.data();
                    response.push(selectedItem);
                }
                return response; 
            })
            return res.status(200).send(response);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Update 
app.put('/api/update/:collection/:id', (req,res) =>{
    (async () =>{
        try{
            let document = db.collection(req.params.collection).doc(req.params.id);
            await document.update(req.body)
            console.log(req.body.name);
            return res.status(200).send(req.body.name);
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Delete 
app.delete('/api/delete/:collection/:id', (req,res) =>{
    (async () =>{
        try{
            let document = db.collection(req.params.collection).doc(req.params.id);
            await document.delete()
            return res.status(200).send();
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


exports.app = functions.https.onRequest(app);