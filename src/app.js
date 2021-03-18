const path = require('path');
express = require('express');
const session = require("express-session");
const NedbStore = require('nedb-session-store')(session);
const api_auth= require("./authentification/input.js")
const api_msg=require("./message/msg.js")
const app = express()



//const api = require('./api.js');

// Détermine le répertoire de base

const basedir = path.normalize(path.dirname(__dirname));

console.debug(`Base directory: ${basedir}`);

//api_1 = require("./api.js");

app.use(session({
    
    secret: "technoweb rocks",
   
    resave: false,
   
    saveUninitialized: false,
   
    store: new NedbStore({
   
        filename: 'sessionsave.db'
   
    })
}));

// nos page ejs 
app.set('view engine','ejs');

app.set('views',__dirname +"/views");

app.get("/register_page",(req,res)=>{

    res.render('input')

});

app.get("/login_page",(req,res)=>{

    res.render('login')

});

app.get("/chatroom",(req,res)=>{

    res.render("chatroom");

})

//app.use('/api', api.default());
app.use('/authentification',api_auth.default());

app.use('/message',api_msg.default());

// Démarre le serveur

app.on('close', () => {

});
exports.default = app;

