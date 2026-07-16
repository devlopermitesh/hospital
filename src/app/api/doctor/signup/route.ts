import { prisma } from "@/lib/prisma";
import { DoctorSignupSchema } from "@/src/app/(frontend)/(dashboard)/dashboard/doctor/components/Form/zodSchema/doctorSignup";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextRequest } from "next/server";

// /**
//  * Sign Doctor create a new doctor in 
//  */
// export const POST=asyncHandler(async(req:NextRequest)=>{
// const body=await req.json()
// const data=DoctorSignupSchema.parse(body)
// //create user and assign Role doctor only if  no email already exits
// const alreadyExitUser=await prisma.
// })
