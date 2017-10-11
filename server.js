"use strict"
var express=require('express');
var app=express();
var path=require('path');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var routes=require('./user/userRoutes');
var ip=require('ip')
//mongo client
//mongoose.connect('mongodb://test:test@ds113935.mlab.com:13935/book_shop')
//local db
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost/user')

var db=mongoose.connection;
db.on('error',console.error.bind(console,'# MongoDB - connection error:'))


// app.get('/',function (req,res) {
//     // debugger
//     // var transporter = nodemailer.createTransport({
//     //     service: 'gmail',
//     //     auth: {
//     //         user: 'lanetteam.monikaa@gmail.com',
//     //         pass: 'lanetteam1'
//     //     }
//     // });
//     //
//     // var mailOptions = {
//     //     from: 'lanetteam.monikaa@gmail.com',
//     //     to: 'lanetteam.sandeepm@gmail.com',
//     //     subject: 'Sending Email using Node.js',
//     //     text: 'That was easy!'
//     // };
//     //
//     // transporter.sendMail(mailOptions, function(error, info){
//     //     console.log(mailOptions)
//     //     if (error) {
//     //         console.log(error);
//     //         res.send('error')
//     //
//     //     } else {
//     //         res.send('shdjsj')
//     //         console.log('Email sent: ' + info.response);
//     //     }
//     // });
//     // //res.send('shdjsj')
//     res.se
// })

//ssroutes(app);
app.use(routes)

app.listen(4000,function(){
    console.log('app listening port 4000')
})