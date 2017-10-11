var mongoose=require('mongoose');

var tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now}
});
var Temps=mongoose.model('Temps',tokenSchema);

module.exports=Temps;