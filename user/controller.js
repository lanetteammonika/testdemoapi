//import model from './model';
var Users = require('./model');
var Temps = require('./tempModel');
var Images = require('./imageModel');
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
var multer = require('multer')


exports.signUp = function (req, res) {

    // console.log('--->call<------', req.body);
    var user = req.body;
    const newUser = new Users(user);
    // Generate a 32 character alpha-numeric token:
    var token = randtoken.generate(32);

    newUser.image = '';
    newUser.token = token;

    console.log(newUser);


    newUser.save(function (err) {
        if (err) {
            return res.send({msg: err.message});
        }

        // Create a verification token for this user
        var token = new Temps({_userId: newUser._id, token: newUser.token});
        // console.log('saved=-----', newUser.email)
        // Save the verification token
        token.save(function (err) {
            if (err) {
                return res.send({msg: err.message});
            }
            //console.log('saved=-----', token)

            // Send the email
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lanetteam.monikaa@gmail.com',
                    pass: 'lanetteam1'
                }
            });
            const verifyLink = 'http://localhost:4000/verifylink/' + newUser.token;
            var mailOptions = {
                from: 'lanetteam.monikaa@gmail.com',
                to: newUser.email,
                subject: 'Sending Email using Node.js',
                text: verifyLink
            };

            transporter.sendMail(mailOptions, function (error, info) {
                console.log(mailOptions)
                if (error) {
                    console.log(error);
                    res.send({msg:'error'})

                } else {
                    res.send({msg:'Success'})
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    });

//Today's Work:-=>create api for registration with email varification using token in node js

}

exports.confirmationPost = function (req, res) {
    // console.log(req.params)

    // Find a matching token
    Temps.find(req.params, function (err, temp) {
        /// console.log('token---',temp)
        if (err) {
            console.log(err)
        } else {
            // console.log('token---',temp)

            if (!temp) return res.send({msg: 'We were unable to find a valid token. Your token my have expired.'});

            // If we found a token, find a matching user
            Users.find({_id: temp[0]._userId}, function (err, user) {
                //console.log('user---',user)

                if (!user) return res.send({msg: 'We were unable to find a user for this token.'});
                if (user[0].isVerified) return res.send({msg: 'This user has already been verified.'});

                // Verify and save the user
                user[0].isVerified = true;
                user[0].save(function (err) {
                    if (err) {
                        return res.send({msg: err.message});
                    }
                    res.send({msg:"The account has been verified. Please log in."});
                });
            });
        }
    });
};

exports.loginPost = function (req, res) {

    Users.findOne({email: req.body.email}, function (err, user) {
        //console.log('user---', req.body.password)
        if (!user) return res.send({msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        //const newUser = new Users(user);
        ///console.log('user---', newUser)
        // const pass=user.email
        if (user.password == req.body.password) {
            if (!user.isVerified) return res.send({
                type: 'not-verified',
                msg: 'Your account has not been verified.'
            });

            // Login successful, write token, and send back user
            //user.token = randtoken.generate(32);
            user.save(function (err) {
                if (err) {
                    return res.send({msg: err.message});
                }
                console.log("Successfull log in.");
                res.send({user: user.toJSON()});
            });
            // res.send({token: randtoken.generate(32), user: user.toJSON()});
        }
        else {
            return res.send({msg: 'Invalid email or password'})
        }
        // user.comparePassword(req.body.password, function (err, isMatch) {
        //     if (!isMatch) return res.send({msg: 'Invalid email or password'});
        //
        //     // Make sure the user has been verified
        //     if (!user.isVerified) return res.send({
        //         type: 'not-verified',
        //         msg: 'Your account has not been verified.'
        //     });
        //
        //     // Login successful, write token, and send back user
        //     res.send({token: generateToken(user), user: user.toJSON()});
        // });
    })
};

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        console.log(file)
        var filename = req.params.id + '.' + file.mimetype.split('/')[1];
        callback(null, filename);

    }
});

// callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);

var upload = multer({storage: storage}).single("userPhoto");

exports.uploadPost = function (req, res) {
    //console.log('img----',res)
    upload(req, res, function (err, data) {
        console.log(err)
        if (err) {
            return res.end("Error uploading file.");
        }
        Users.findByIdAndUpdate({_id: req.params.id}, {image: req.file.path}, {
            upsert: true,
            returnNewDocument: true
        }, function (err, data) {
            if (err) {
                return res.end("Error while update image in database");
            }
            else {
                debugger

                const newImage = new Images();
                newImage.image = req.file.path.split('/')[1];
                newImage.userId = req.params.id;
                newImage.friendId = '';
                newImage.like = 0;
                newImage.comment = '';
                newImage.save(function (err) {
                    if (err) {
                        return res.end("Error while save image in database");
                    }
                    return res.send({msg:'Success'});
                })
            }
        })

        // res.end("File is uploaded");
    });
}

exports.getPost = function (req, res) {
    const imgFolder = __dirname + '/../uploads/';
    console.log('---->call<-----', imgFolder)
    const fs = require('fs');
    fs.readdir(imgFolder, function (err, files) {
        if (err) {
            return console.log(err);
        }
        const filesArr = [];
        var i = 1;

        files.forEach(function (file) {
            filesArr.push({image: file});
            i++;
        })
        res.json(filesArr);
    })
}

exports.updatePost = function (req, res) {

    Images.findOne({_id: req.params.imgid}, function (err, image) {
        var user = req.body;

       //console.log(user);
        if (err) {
            //res.send(err);
            return console.log(err);
        }

        image.like=image.like+req.body.like;
        image.userId=req.body.userId;
        image.friendId=req.body.friendId;
        image.comment=req.body.comment;
        image.save(function (err) {
            if (err) {
                return res.end("Error while save image in database");
            }
            return res.send(image);
        })
        console.log(image);
    })
}
