const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");


dotenv.config({path:'./.env'});
const app=express();

app.use(cookieParser());

console.log("JWT_SECRET =", process.env.JWT_SECRET);

hbs.registerPartials(
    path.join(__dirname, "views", "partials")
);

const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

const publicDirectory = path.join(__dirname,"./public");
app.use(express.static(publicDirectory));


app.use(express.urlencoded( {extended:false}));

app.use(express.json());

app.set('view engine','hbs');
app.disable('view cache');
app.set('view cache', false);

app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(
    path.join(__dirname, "views", "partials")
);

db.connect((error)=>{
    if(error){
        console.log(error);
    } else {
        console.log("Mysql is Connected");
    }
});


app.use('/',require("./routes/page"));
app.use('/auth',require('./routes/auth'));

// app.post("/test", (req, res) => {

//     console.log(req.body);

//     res.send("working");
// });

app.listen(5000,()=>{
    console.log("server started on port 5000");
});
