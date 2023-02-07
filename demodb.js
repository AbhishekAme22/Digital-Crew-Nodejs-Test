const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const port = 5000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);





//connect to the mysql database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "inventory"
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

app.use(cors());
app.use(bodyParser.json());

//Retrieve the entire inventory
app.get("/inventory", (req, res) => {
  let sql = "SELECT * FROM inventory";
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Retrieve a single item from the inventory
app.get("/inventory/:id", (req, res) => {
  let sql = `SELECT * FROM inventory WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//Add a new item to the inventory
app.post("/inventory", (req, res) => {
  let data = {
    item_name: req.body.item_name,
    item_description: req.body.item_description,
    item_quantity: req.body.item_quantity
  };
  let sql = "INSERT INTO inventory SET ?";
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    io.sockets.emit("inventory update", item);
    res.send(result);
  });
});

//Update an existing item in the inventory
app.put("/inventory/:id", (req, res) => {
  let sql = `UPDATE inventory SET item_name='${req.body.item_name}', item_description='${req.body.item_description}', item_quantity='${req.body.item_quantity}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    io.sockets.emit("inventory update", item);
    // Return the updated item data
    res.json(item);
    res.send(result);
  });
});

//Remove an item from the inventory
app.delete("/inventory/:id", (req, res) => {
  let sql = `DELETE FROM inventory WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
      // Broadcast the update to all connected clients
      io.sockets.emit("inventory update", { id: req.params.id });

      // Return a success message
      res.json({ message: "Item removed from inventory" });
    res.send(result);
  });
  
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


io.on("connection", socket => {
    console.log("Socket connected: " + socket.id);
  });
