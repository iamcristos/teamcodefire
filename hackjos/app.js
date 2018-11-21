const express= require ('express');
const bodyParser= require('body-parser');
const port= process.env.PORT || 3040;
const path= require('path');
const mongodb= require('mongoose');
const session=require('express-session');
const flash= require('connect-flash');
const expressValidator=require('express-validator');
const handlebars= require('express-handlebars');
const passport=require('passport')
const config= require('./config/database');
let homeRoute= require('./routes/home');
let categoryRoute= require('./routes/category');
let commentRoute= require('./routes/comment')



//creating our express app
const app= express();

// setting our view engine
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs',handlebars({defaultLayout: "layout", extname: ".hbs"}))
app.set('view engine', '.hbs');
// setting up our static file
app.use(express.static(path.join(__dirname, 'public')));


// connecting to our database
mongodb.connect(config.database, { useNewUrlParser: true });
let db=mongodb.connection;

db.once('open', function(){
    console.log('connected')
});

db.on('error', function(err){
    console.log(err)
});

//middleware for body parser

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  //require passport
require('./config/passport')(passport)

  //passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express messages middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg= req.flash('success_msg');
  res.locals.error_msg= req.flash('error_msg')
  next();
});

// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

//home route



//setting our routes
app.use('/', homeRoute);
app.use('/category', categoryRoute);
app.use('/comment', commentRoute);
//listening to our app
app.listen(port, ()=>{
    console.log('app is running at '+ port)
})