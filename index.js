const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const port =process.env.PORT || 5000;
app.use(bodyParser.json())
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const servicesCollection = client.db("akIndustry").collection("services");
  const reviewsCollection = client.db("akIndustry").collection("reviews");

  app.post('/review', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});



app.listen(port)



