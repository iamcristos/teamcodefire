const mongodb= require('mongoose')

let commentSchema= mongodb.Schema();
commentSchema= {
    message : {
        type: String,
        require: true
    }
}

let comment = module.exports= mongodb.model('comment', commentSchema);