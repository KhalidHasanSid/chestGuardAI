import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import Patient from "../models/patient.model.js";

const auth =(role)=>{return asyncHandler(async (req,res,next)=>{
    console.log("hi")
    try{
        console.log(req.cookies.accessToken)
    const token=req.cookies.accessToken
    console.log("_________")
    console.log("==",token)


    if(!token){throw new apiError(400,"msla arha h ..........")}

    const decoded =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("chk krha hun",decoded)
    let user =await User.findById(decoded._id)
        
    if(!user){
        user =await Patient.findById(decoded._id)

        if(!user){
        throw new apiError(400," user he nh h ..................")}}

        if(role!==user.role)throw new apiError(400," access denied")
            console.log(role,"===",user.role)
    req.user=user 
    console.log("helo world",req.user)
    next();
}
    catch(err){console.log("/////////////////////",err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired, please login again.' });
          }
          next(err);
    }


})}

export default auth 