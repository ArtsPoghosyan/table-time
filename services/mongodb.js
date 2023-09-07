const mongoose = require("mongoose");

const { MONGO_URL } = process.env;

(async function(){
    try{
        await mongoose.connect(MONGO_URL);
        console.log("Database Connected");
    }catch(err){
        console.error(err);
    }
})();

module.exports = mongoose;