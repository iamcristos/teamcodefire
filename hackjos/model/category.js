const mongodb= require('mongoose');

let categorySchema=mongodb.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    }
});

let category = module.exports= mongodb.model('category', categorySchema);


module.exports.getCategories = (callback, limit)=>{
    category.find(callback).limit(limit).sort([['title', 'ascending']]);
    
};