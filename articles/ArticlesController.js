const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify")


router.get("/admin/articles", (req, res) => {
  res.render("admin/articles/index");
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new" ,{
      tinymceKey: process.env.TINYMCE_API_KEY,
      categories: categories
    });
  });
});

router.post("/articles/save", (req,res)=>{
    var title = (req.body.title || "").trim();
    var body = (req.body.body||"").trim();
    var category = Number(req.body.category);


    Article.create({
        title: title,
        slug: slugify(title,{
            lower: true,
            strict: true
        }),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles");
    })
});


module.exports = router;