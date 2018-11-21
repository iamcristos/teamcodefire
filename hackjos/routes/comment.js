const express= require('express');
const route= express.Router();

let comment= require('../model/comment');

route.post('/', (req,res,next)=>{
    let comments= new comment({
        message: req.body.message
    });
    console.log(comments)
    comments.save((err, comments)=>{
        if (err) {
            return console.log(err)
        } else {
            console.log(comments)
            res.render('explore')
        }
    })
});

route.get('/', (req,res,next)=>{
    let quarry= {message:req.body.message};
    console.log(quarry)
    comment.find({quarry}, (err,comments)=>{
        if (err) {
            return console.log(err)
        }console.log(comments) 
        res.render('explore',{
            comments:comments
            
        })
    })
    
});

module.exports=route