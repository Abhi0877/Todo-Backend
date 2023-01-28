const { default: mongoose } = require("mongoose")

const userSchema = new mongoose.Schema({

    title : {
        type:String,
        required:true,
        trim:true,
    },
    description : {
        type:String,
        required:true,
        trim:true,
    },
    priority:{
        type:String,
        trim:true,
    },
    status:{
        type:String,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

module.exports = new mongoose.model("Task",userSchema)