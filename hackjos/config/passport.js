const localStrategy= require('passport-local').Strategy;
const config= require('./database');
const user= require('../model/user');
const bcrypt= require('bcryptjs');


module.exports= function(passport){
    //local strategy
    passport.use(new localStrategy(function(username,password,done){
        //match username
        let querry= {username:username};
        user.findOne(querry, function(err, user){
            if (err) throw err;
            if (!user) {
                return done(null, false, {message:'no user'})
            };

        //match password
        bcrypt.compare(password, user.password, function(err,isMatch){
            if(err) throw err
            if (isMatch){
                return done(null, user)
            } else {
                return done(null, false, {message:'wrong password'})
            }
        })
        });
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
      });
}