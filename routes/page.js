const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        isHome: true
    });
});

router.get("/about", (req, res) => {
    res.render("about", {
        isAbout: true
    });
});

router.get("/project", (req, res) => {
    res.render("project", {
        isProject: true
    });
});

router.get("/contact", (req, res) => {
    res.render("contact", {
        isContact: true
    });
});

module.exports = router;