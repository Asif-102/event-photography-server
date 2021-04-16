const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wp8tr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
    res.send('welcome to event photography api')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const adminCollection = client.db(process.env.DB_NAME).collection("admins");
    const reviewCollection = client.db(process.env.DB_NAME).collection("reviews");
    
    app.post('/addAdmin', (req,res)=>{
        const newAdmin = req.body;
        // console.log(newAdmin);
        adminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/admin',(req,res)=>{
        const email = req.query.email;
        adminCollection.find({email:email})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/addReview',(req,res)=>{
        const newReview = req.body;
        reviewCollection.insertOne(newReview)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/reviews',(req,res)=>{
        reviewCollection.find()
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })


});






app.listen(port, () => {
    console.log(`Example app listening port at http://localhost:${port}`)
})