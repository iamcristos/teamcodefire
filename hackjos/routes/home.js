const express= require('express');
const route= express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport');
const nodemailer= require('nodemailer');
const async = require('async');
const crypto= require('crypto');
const xoauth2 = require('xoauth2');

let user= require('../model/user');



route.get('/', (req,res,next)=>{
 res.render('index');
});

   
//register route
route.get('/register', (req,res,next)=>{
    res.render('signUp');
   });

//register post route
route.post('/register', (req,res,next)=>{
    const name= req.body.name;
    const username=req.body.username;
    const email= req.body.email;
    const password= req.body.password
    const password2=req.body.password2

    //validate registration form
    req.checkBody('name','name is required').notEmpty();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','password dont match').equals(req.body.password);

    let errors= req.validationErrors();

    if (errors) {
        res.render('signUp', {
            error:errors
        });
    }
    else {
        let newUser= new user({
            name: name,
            username: username,
            email: email,
            password: password
        });

    bcrypt.genSalt(10, function(error, salt){
        bcrypt.hash(newUser.password,salt,function(error, hash){
            if (error){
                console.log(err)
            } 
            newUser.password=hash;
            console.log(hash)

            newUser.save(function(error){
                if (error) {
                    console.log(error)
                    return;
                } else {
                    req.flash('success_msg', 'successfully registerd');
                    res.redirect('/login')
                }
            })
        })
        
    })
    }
    
});

//login route
route.get('/login', (req,res,next)=>{
  res.render('login');
 });

 
  
 route.post('/login', function(req,res,next){
  passport.authenticate('local', {
      successRedirect:'/comment',
      failureRedirect:'/login',
      failureFlash: true
  })(req,res,next)
})



// forgot password
route.get('/forget',(req,res,next)=>{
    res.render("forgot", {
        user:req.user
    })
})

// recovering the password
route.post('/forget', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
          //   console.log('error', 'No account with that email address exists.');
          req.flash('error_msg', 'No account with that email address exists.');
            return res.redirect('/forget');
          }
  console.log('step 1')
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
          console.log('step 2')
  
  
        var smtpTrans = nodemailer.createTransport({
           service: 'Gmail', 
           auth: {
            user: 'iamthecristos@gmail.com',
            pass: '1stclass'
          }
        });
        var mailOptions = {
  
          to: user.email,
          from: 'iamthecristos@gmail.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  
        };
        console.log('step 3')
  
          smtpTrans.sendMail(mailOptions, function(err) {
          req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          console.log('sent')
          res.redirect('/forget');
  });
  }
    ], function(err) {
      console.log('this err' + ' ' + err)
      res.redirect('/login');
    });
  });  

  //retriving password
  route.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log(user);
      if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
       User: req.user
      });
    });
  });
  
  
  
  
  route.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user, next) {
          if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          console.log('password' + user.password  + 'and the user is' + user)
  
  user.save(function(err) {
    if (err) {
        console.log('here')
         return res.redirect('/forget');
    } else { 
        console.log('here2')
      req.logIn(user, function(err) {
        done(err, user);
      });
  
    }
          });
        });
      },
  
        function(user, done) {
          // console.log('got this far 4')
        var smtpTrans = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'iamthecristos@gmail.com',
            pass: '1stclass'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'iamthecristos@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            ' - This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTrans.sendMail(mailOptions, function(err) {
          req.flash('success_msg', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
//logout route
route.get('/logout', function(req,res){
    req.logout();
    req.flash('success_msg', 'Log out successfully');
    res.redirect('/login')
})

module.exports= route