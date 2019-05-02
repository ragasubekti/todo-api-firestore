const express = require("express");
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const cors = require("cors");

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.get("/todos", (req, res) => {
  db.collection("todos")
    .get()
    .then(result => {
      let todos = [];
      result.forEach(item => {
        const data = item.data();
        const { created_at, updated_at } = data;

        todos.push({
          ...data,
          id: item.id,
          created_at: created_at.toDate(),
          updated_at: updated_at.toDate()
        });
      });

      return res.send({ data: todos, total: todos.length });
    })
    .catch(err => {
      console.log(err);
      res.send({
        message: "theres nothing here"
      });
    });
  // return res.send("Hello World");
});

app.post("/todos", (req, res) => {
  const create = db.collection("todos").doc();
  create
    .set({
      content: req.body.content,
      done: false,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then(() => {
      return res.send({
        message: "Todos Succesfully Created."
      });
    });
});

app.put("/todos", (req, res) => {
  const create = db.collection("todos").doc(req.query.id);
  create
    .update({
      content: req.body.content,
      updated_at: new Date()
    })
    .then(() => {
      return res.status(200).send({
        message: "Todos Succesfully Updated."
      });
    });
});

app.put("/todos/done", (req, res) => {
  const create = db.collection("todos").doc(req.query.id);
  create
    .update({
      content: req.body.content,
      done: true,
      updated_at: new Date()
    })
    .then(() => {
      return res.status(200).send({
        message: "Todos Succesfully Updated."
      });
    })
    .catch(err => {
      return res.status(500).send({
        message: err
      });
    });
});

app.delete("/todos", (req, res) => {
  db.collection("todos")
    .doc(req.query.id)
    .delete()
    .then(result => {
      return res.status(200).send({
        successs: true,
        message: "todo successfully deleted"
      });
    });
});

exports.v1 = functions.https.onRequest(app);
