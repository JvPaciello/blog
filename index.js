require("dotenv").config();

const express = require("express");
const app = express();
const porta = process.env.PORT;
const bodyParser = require("body-parser");
const connection = require("./database/database");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");


app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.authenticate().then(() => {
  console.log("Conectado ao banco de dados!");
}).catch((error)=>{
    console.log(error);
})


app.use("/",(categoriesController));
app.use("/",(articlesController));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(porta, () => {
  console.log("Servidor rodando na porta: " + porta);
});
