const express= require('express');
const route= express.Router();

const category = require('../model/category');


route.get('/', (req,res,next)=>{
    category.getCategories((err,categories)=>{
        if(err){
            res.send(err)
        }
        console.log(categories);
        res.render('explore')
        })
 });
 
 route.post('/', (req,res,next)=>{
     let categories= new category({
         title: req.body.title,
         author: req.body.author,
         description: req.body.description
     });
     categories.save((err) =>{
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
     })

 })

 route.get('/add', (req,res,next)=>{
     res.render('category')
 })

//  route.post('/add:id', (req,res,next)=>{
//      let users = new user ({
//         //  userid=req.params.id,
//          message= req.body.message
//      });
//      users.save((err,user)=>{
//          if (err) {
//              return console.log(err)
//          } else {
//              res.render('/category/add', {
//                  user:user
//              })
//          }
//      })
//  })

module.exports= route