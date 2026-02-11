import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description:{
        type:String,
        required : true
    },
    // Majorly we post skills in requirement
    requirement:[{
        type:String,
        required : true
    }],
    salary:{
        type:Number,
        required : true
    },
    experienceLevel:{
        type: Number,
        required:true,
    },
    location:{
        type:String,
        required:true
    },
    jobType:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    // since there is a relation between company and job, 
    // we can use company schema by : ref:'Company
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    // we can use User schema by ref:'User'.
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    applications:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:'Application',
        }
    ],
},
{ timestamps: true } 
);

export const Job = mongoose.model("Job",jobSchema);