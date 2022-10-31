const mongoose = require('mongoose');
console.log("entered")
module.exports = async () => {
    try{
        const Murl=process.env.MONGODB_URL
        console.log(Murl)
        console.log(typeof(Murl))
        await mongoose.connect(Murl,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
        var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    }
    catch(e){
        console.log("mongo db connection error: " + e.message);

    }
}