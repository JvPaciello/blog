const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
  res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
  var title = (req.body.title || "").trim();

  if (!title) {
    return res.redirect("/admin/categories/new");
  }

  Category.create({
    title: title,
    slug: slugify(title, {
      lower: true,
      strict: true,
    }),
  }).then(() => {
    res.redirect("/");
  });
});


router.get("/admin/categories", (req,res)=>{
  Category.findAll().then(categories=>{
    res.render("admin/categories/index",{categories: categories});
  });
});

router.post("/categories/delete", (req,res) =>{
  var id = Number(req.body.id);
  if(!id||isNaN(id)){
    return res.redirect("/admin/categories");
  }
  Category.destroy({
    where:{
      id: id
    }
  }).then(()=>{
    res.redirect("/admin/categories");
  });
});

module.exports = router;
