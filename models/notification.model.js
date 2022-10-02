const mongoose=require('mongoose');
console.log("commed")
const Schema=mongoose.Schema;

const notificationsSchema=Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    date:{type:String}
    // photoUrl: { type: String ,required:true},
},{timestamps:true})
module.exports=mongoose.model('Notifications',notificationsSchema,"notifications");