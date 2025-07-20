import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import uploadCloudinary from "../utils/cloudinary.js";
import Detection from "../models/detection.model.js";
import Patient from "../models/patient.model.js";

const detectionController =asyncHandler(async (req,res,next)=>{


    const MR_no=req.params.MR_no.trim()
    const xrayImage=req.file
    console.log("kia:",MR_no)
    console.log(typeof(MR_no),"========================================",typeof(xrayImage.path))
    // if(!xrayImage.path){throw new  apiError(409,"no image obtained")}
   

    const i = Math.random() < 0.5 ? 0 : 1;

    let arr=['pneumonia','tuberclosiss'];

    const resulttemp = arr[i] 
    console.log(resulttemp) 

  

    const image = await uploadCloudinary(xrayImage.path)
    console.log("milgayi",image,"==",image.url)
    if(!image){throw new apiError(499,"image url is missing ")}
   

  

const patientexist = await Patient.findOne({MR_no:MR_no} )
console.log("Query Result:", patientexist);

    

    let patientDetection =await Detection.findOne({patient:patientexist._id})

    console.log(patientDetection,"==========================")

    if(!patientDetection){
        patientDetection=await Detection.create({
    patient:patientexist._id,
    detection:[
       { xray:image.url,
         date: new Date(),
        result:resulttemp
    }

    ]
    })}
    else{

    await  patientDetection.detection.push({ xray:image.url,
        date: new Date(),
       result:resulttemp
   })}
   patientDetection= await patientDetection.save()

   console.log("hmmm",patientDetection)

    


    res.json(new apiResponse(200,patientDetection,"result generated "))

})
  const getDetectedResults = asyncHandler(async(req,res)=>{
      const patient = req.user
      




      const result =await Detection.findOne({patient:patient._id})

      res.json(new apiResponse(200, result.detection,"result recieve"))
     
  })   

  const authchecker =asyncHandler((req,res)=>{
    console.log("auth is working fine ")
  })


export {detectionController ,getDetectedResults,authchecker}