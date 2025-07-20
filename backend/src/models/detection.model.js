import mongoose ,{Schema}from "mongoose";
import Patient from "./patient.model.js";


const detectionSchema = mongoose.Schema({

    patient:{
        type:Schema.Types.ObjectId,
        ref:"Patient"
     },

     detection: [
           {
               xray: {type:String,
                trim: true,
                required:true
                     
               },
               date:{
                type:Date,
                required:true
               },
               result:{
                type:String,
                required:true
               }

               

           }
     ]
},{timestamps:true})


const Detection =mongoose.model("Detection",detectionSchema)

export default Detection