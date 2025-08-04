const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true ,
    },
    rollNumber : {
        type : Number,
        required : true ,
        unique : true,
    },
    password :{
        type : String ,
        required : true,
    },
    isAdmin :{
      type:Boolean,
      default:false
    }
})


studentSchema.methods.GenerateAuthToken = function () {
     const payload = {
      student: {
        name : this.name,
        id: this._id,
        rollNumber: this.rollNumber,

      },
    };
    const token = jwt.sign(payload , process.env.JWT_SECRET ,{expiresIn : "1h"});
    return token;
};

module.exports = mongoose.model("Student" , studentSchema);