const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth,(req, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles: articles });
  });
});

router.get("/admin/articles/new", adminAuth ,(req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", {
      tinymceKey: process.env.TINYMCE_API_KEY,
      categories: categories,
    });
  });
});

router.post("/articles/save", adminAuth,(req, res) => {
  var title = (req.body.title || "").trim();
  var body = (req.body.body || "").trim();
  var category = Number(req.body.category);

  Article.create({
    title: title,
    slug: slugify(title, {
      lower: true,
      strict: true,
    }),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", adminAuth,(req, res) => {
  var id = Number(req.body.id);

  if (!id || isNaN(id)) {
    return res.redirect("/admin/articles");
  }

  Article.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.get("/admin/articles/edit/:id", adminAuth,(req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.redirect("/admin/articles");
  }

  Article.findByPk(id).then(article => {
    if (!article) {
      return res.redirect("/admin/articles");
    }

    Category.findAll().then(categories => {
      res.render("admin/articles/edit", {
        article: article,
        categories: categories,
        tinymceKey: process.env.TINYMCE_API_KEY
      });
    });
  }).catch(() => {
    return res.redirect("/admin/articles");
  });
});


router.post("/articles/update",adminAuth,(req,res)=>{
  var id = Number(req.body.id);
  var title = (req.body.title || "").trim();
  var body = (req.body.body || "").trim();
  var categoryId = Number(req.body.category);

  Article.update({
    title: title,
    body: body,
    categoryId: categoryId,
    slug: slugify(title, {
      lower: true,
      strict: true,
    })
  },{
    where:{
      id:id
    }
  }).then(()=>{
    res.redirect("/admin/articles")
  }).catch(err=>{
    res.redirect("/")
  });

});


router.get("/articles/page/:num", (req, res) => {
  const page = Number(req.params.num);
  const limit = 4;

  const offset = page > 1 ? (page - 1) * limit : 0;

  Article.findAndCountAll({
    limit,
    offset,
        order:[[
      'id','DESC'
    ]]
  }).then(articles => {

    const next = offset + limit < articles.count;

    const result = {
      page: Number(page),
      next,
      articles
    };

    Category.findAll().then(categories => {
      return res.render("admin/articles/page", {
        result,
        categories
      });
    });
  });
});

router.get("/category/:slug/page/:num", (req, res) => {

  const slug = req.params.slug;
  const page = Number(req.params.num);
  const limit = 4;

  const offset = page > 1 ? (page - 1) * limit : 0;

  Category.findOne({
    where: { slug: slug }
  }).then(category => {

    if(!category){
      return res.redirect("/");
    }

    Article.findAndCountAll({
      where: { categoryId: category.id },
      limit,
      offset,
      order: [['id', 'DESC']]
    }).then(articles => {

      const next = offset + limit < articles.count;

      const result = {
        page,
        next,
        articles
      };

      Category.findAll().then(categories => {
        res.render("index", {
          result,
          categories,
          currentCategory: category
        });
      });

    });

  });

});


module.exports = router;
