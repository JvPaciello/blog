require("dotenv").config();

const express = require("express");
const app = express();
const porta = process.env.PORT;
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

app.set("view engine", "ejs");

app.use(session({
  secret: "ALSKJNDFB412[[[[]]]]]]]]][pA713YT780BODIUFABSOI98021Y109OIBDSJFBA078G1'87VB9281VR872VB80",
  cookie: {maxAge: 30000000}
}))

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
app.use("/",(usersController));


app.get("/", (req, res) => {

  const limit = 4;
  const offset = 0;

  Article.findAndCountAll({
    limit,
    offset,
    order: [['id','DESC']]
  }).then(resultDB => {

    const next = limit < resultDB.count;

    const result = {
      page: 1,
      next,
      articles: resultDB.rows
    };

    Category.findAll().then(categories => {
      res.render("index", {
        result,
        categories
      });
    });

  });

});



app.get("/category/:slug",(req,res)=>{

  const slug = req.params.slug;
  const limit = 4;
  const offset = 0;

  Category.findOne({
    where:{ slug }
  }).then(category => {

    if(!category){
      return res.redirect("/");
    }

    Article.findAndCountAll({
      where:{ categoryId: category.id },
      limit,
      offset,
      order:[['id','DESC']]
    }).then(resultDB => {

      const next = limit < resultDB.count;

      const result = {
        page: 1,
        next,
        articles: resultDB.rows
      };

      Category.findAll().then(categories => {
        res.render("index", {
          result,
          categories
        });
      });

    });

  });

});


app.listen(porta, () => {
  console.log("Servidor rodando na porta: " + porta);
});
