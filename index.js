const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port =process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json())
// app.use(express.urlencoded({extended:false}));


app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const servicesCollection = client.db("akIndustry").collection("services");
  const reviewsCollection = client.db("akIndustry").collection("reviews");

  app.post('/services', (req, res) => {
    const services = req.body;
    servicesCollection.insertOne(services)
    .then(result => {
      console.log(result);
      res.send(result.insertedCount > 0);
    })
  })

  app.post('/review', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/serviceData', (req, res) => {
    servicesCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/reviewData', (req, res)=> {
    reviewsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/serviceInfo/:id', (req, res) => {
    const id = req.params.id;
    servicesCollection.find({name: id})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

});



app.listen(port)



