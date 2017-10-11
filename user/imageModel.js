var mongoose=require('mongoose');

var imageSchema = new mongoose.Schema({
    image:String,
    userId:String,
    friendId:String,
    like:Number,
    comment:String,
    isApprove:{ type: Boolean, default: false }
});
var Images=mongoose.model('Images',imageSchema);

module.exports=Images;