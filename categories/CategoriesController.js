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

module.exports = router;
