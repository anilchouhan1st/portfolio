const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        isHome: true
    });
});

router.get("/about", (req, res) => {
    res.redirect("/#about");
});

router.get("/project", (req, res) => {
    res.redirect("/#projects");
});

router.get("/contact", (req, res) => {
    res.redirect("/#contact");
});

module.exports = router;