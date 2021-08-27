const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s07ju.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("silotech").collection("products");
  const ordersCollection = client.db("silotech").collection("orders");
  const adminsCollection = client.db("silotech").collection("admins");

  app.get("/products", (req, res) => {
    productsCollection.find().toArray((err, products) => {
      res.send(products);
    });
  });

  app.get("/isAdmin", (req, res) => {
    const queryEmail = req.query.email;
    adminsCollection.find({ email: queryEmail }).toArray((err, email) => {
      res.send(email);
    });
  });
  
  app.get("/orderedProducts", (req, res) => {
    const queryEmail = req.query.email;
    ordersCollection.find({ email: queryEmail }).toArray((err, products) => {
      res.send(products);
    });
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    productsCollection.deleteOne({ id: req.params.id }).then((documents) => {
      res.send(documents.deletedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
