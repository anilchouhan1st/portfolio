const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");


dotenv.config({path:'./.env'});
const app=express();


hbs.registerPartials(
    path.join(__dirname, "views", "partials")
);

const publicDirectory = path.join(__dirname,"./public");
app.use(express.static(publicDirectory));


app.use(express.urlencoded( {extended:false}));

app.use(express.json());

app.set('view engine','hbs');
// app.disable('view cache');
app.set('view cache', false);

app.set("views", path.join(__dirname, "views"));
// hbs.registerPartials(
//     path.join(__dirname, "views", "partials")
// );

app.use('/',require("./routes/page"));

app.listen(5000,()=>{
    console.log("server started on port 5000");
});
