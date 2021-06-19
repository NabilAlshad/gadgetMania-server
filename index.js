const express = require("express");
require("dotenv").config();

const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const port = 3210;
app.use(cors());
app.use(bodyParser());

console.log(process.env.DB_USER);

const MongoClient = require("mongodb").MongoClient;
const { ObjectID } = require("mongodb").ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sblya.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("FreshUser").collection("products");
  const ordersCollection = client.db("FreshUser").collection("orders");
  console.log("database connected");
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection
      .insertOne(product)
      .then((result) => res.send(result.insertedCount > 0));
    // console.log("products is here", product);
  });
  app.get("/products", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
      // console.log("items", items);
    });
  });
  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, items) => {
        res.send(items[0]);
        // console.log("items", items[0]);
      });
  });
  app.post("/addOrder", (req, res) => {
    const orders = req.body;
    ordersCollection
      .insertOne(orders)
      .then((result) => res.send(result.insertedCount > 0));
    // console.log("products is here", orders);
  });
  app.delete("/deleteProduct/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log("delete this", id);
    productCollection.deleteOne({ _id: id }).then((result) => {
      console.log(result);
      res.send(result.deletedCount > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("welcome to fresh valley assingment");
});

app.listen(process.env.PORT || port, () => {
  console.log("connected");
});
