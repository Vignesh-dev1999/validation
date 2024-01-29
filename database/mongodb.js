const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Mongodb connected successfully");
})
.catch((error)=>{
    console.log(error);
})

module.exports = mongoose.connection