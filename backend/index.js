const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true 
}));

const csrfProtection = csrf({cookie: true})
const parser = bodyParser.urlencoded({extended:false})
app.use(cookieParser());
app.get('/csrf-token', csrfProtection,function(req,res){
    res.json({csrfToken: req.csrfToken()});
})
app.post('/submit',csrfProtection ,function(req,res){
    res.send('les donnees sont bien traite');
})
app.listen(5000,()=>{
    console.log('serveur démarré ');
 
})

