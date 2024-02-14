const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

var CONNECTION_STRING =
  "mongodb+srv://vergaraxy:hdMn7tG964ynkXlU@cluster0.ab5ftyu.mongodb.net/Marketplace?retryWrites=true&w=majority";
var DATABASE_NAME = "Marketplace";
var database;

app.get("/api/products", (req, res) => {
  const nameQuery = req.query.name;
  if (nameQuery) {
    database.collection("product")
      .find({ "name": { $regex: nameQuery, $options: 'i' } })
      .toArray((err, result) => {
        if (err) {
          console.error("Error fetching products:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(result);
      });
  } else {
    database.collection("product")
      .find({})
      .toArray((err, result) => {
        if (err) {
          console.error("Error fetching products:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.send(result);
      });
  }
});

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  database.collection("product")
    .findOne({ "_id": ObjectId(productId) }, (err, result) => {
      if (err) {
        console.error("Error fetching product:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
});

app.post("/api/products", (req, res) => {
  const newProduct = req.body;
  database.collection("product").insertOne(newProduct, (err, result) => {
    if (err) {
      console.error("Error adding new product:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(201).json({ message: "Product added successfully", productId: result.insertedId });
  });
});

app.put("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  database.collection("product").updateOne({ "_id": ObjectId(productId) }, { $set: updatedProduct }, (err, result) => {
    if (err) {
      console.error("Error updating product:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json({ message: "Product updated successfully", productId: productId });
  });
});

app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  database.collection("product").deleteOne({ "_id": ObjectId(productId) }, (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json({ message: "Product deleted successfully", productId: productId });
  });
});

app.delete("/api/products", (req, res) => {
  database.collection("product").deleteMany({}, (err, result) => {
    if (err) {
      console.error("Error deleting all products:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json({ message: "All products deleted successfully" });
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Online Market application." });
});

app.listen(3000, () => {
  MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return;
    }

    database = client.db(DATABASE_NAME);
    console.log("Connected to the database");

    console.log("Server is listening on port 3000");
  });
});
