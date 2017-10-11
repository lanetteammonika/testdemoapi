
var express=require('express');
var app=express();
var controller=require('./controller')

app.post('/confirmation', controller.signUp);
app.get('/verifylink/:token', controller.confirmationPost);
app.post('/login', controller.loginPost);
app.post('/uploadpost/:id',controller.uploadPost);
app.get('/getpost',controller.getPost);
app.post('/updatepost/:imgid',controller.updatePost);

module.exports=app;