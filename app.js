const express = require("express");
const handlebars = require("express-handlebars");
const mysql = require("mysql");
const questions = require("./assets/js/questions");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.PW,
  database: "friendfinder"
});

db.connect(err => {
  if (err) throw err;
  console.log("Connected to DB! 🤖");
});

app.get("/", (_, res) => {
  res.render("index", { question: questions });
});

app.get('/api/findfriend/:type', (req, res) => {
  const type = req.params.type;
  db.query('select name from friend where type = ? limit 1', type, (err, data) => {
    if (err) throw err;
    res.send(data);
  })
});

app.post("/api/addfriend", (req, res) => {
  const name = req.body.name
  const type = req.body.type
  db.query(
    `insert into friend(name, type)
    values(?,?)`, 
    [name, type],
    (err, _) => {
      if (err) throw err;
      res.send(200).end();
    })
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});