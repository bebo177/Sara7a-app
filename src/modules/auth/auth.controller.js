import { Router } from "express";
import { generateAccessToken, login , logout, signup, signupGoogle, toggleTwoStepVerfication, verifyEmail, verifyTwoStep , forgetPassword, twoStepLoginVerify,resetPassword } from "./auth.service.js" ;
import { SuccessResponse } from "../../common/utils/responses/index.js";
import { auth, extentions, upload, validation} from "../../common/middleware/index.js";
import {loginSchema, signupSchema,forgetPasswordSchema,resetPasswordSchema,twoStepLoginVerifySchema,verifyEmailSchema,verifyTwoStepSchema,resetPasswordSchema} from "./auth.validation.js";
import { SuccessResponse } from '../../common/utils/responses/success.response';

const router = Router();

router.post('/signup', upload({customPath: 'image/users/profileImage', allowedExtentions: extentions.image}).single('image'), validation(signupSchema),async (req,res)=>{
    let addedUser = await signup(req.body , req.file);
    return SuccessResponse({res , message: "user signed up successfully" , status:201 , data: addedUser})
})
router.post('/toggle-2-step-verification', auth , async(req,res)=>{
    let data = await toggleTwoStepVerfication(req.userId);
    return SuccessResponse({res , message: 'Email sent successfully' , status: 200, data});
})
router.post('/verify-two-step' , auth, validation(verifyTwoStepSchema), async(req,res)=>{
let data = await verifyTwoStep(req.userId, req.body);
return SuccessResponse({res, message:'User Two Step Verified successfully', status: 200, data});
})
router.post('/verify-email', validation(verifyEmailSchema), async(req,res)=>{
    let data = await verifyEmail(req.body);
    return SuccessResponse({res, message: "Email verified successfully", status: 200, data});
})
router.post('/login', validation(loginSchema) , async (req,res)=>{
    let userData = await login(req.body , `${req.protocol}://${req.host}`);
    return SuccessResponse({res , message: "user login successfully" , status:200 , data: userData})
})
router.post('/login/verify-two-step-login', valiadtion(twoStepLoginVerifySchema) , async(req,res)=>{
    let data = await twoStepLoginVerify(req.body , `${req.protocol}://${req.host}`);
    return SuccessResponse({res, message: 'user two step verification logged-in successfully', status: 200, data});
})

router.post('/generate-access-token', async(req,res)=>{
    let { authorization } = req.headers;
    let accessToken = await generateAccessToken(authorization);
    return SuccessResponse({res , message:"access token created successfully", status: 200, data: accessToken});
})
router.post('/logout', auth , async(req,res)=>{
    let user = await logout(req);
    return SuccessResponse({res, message: "user logged out successfully" , status: 200, user});
})
router.post('/signup/gmail', async(req,res)=>{
    let data = await signupGoogle(req.body);
    return SuccessResponse({res , message: "user signed up successfully" , status: 201 , data})
})

router.post('/forget-password', validation(forgetPasswordSchema), async(req,res)=>{
    let data = await forgetPassword(req.body);
    return SuccessResponse({res, message: 'Email Confirmation With OTP Sent to Reset Your Password', status: 200, data});
})
router.put('/reset-password', validation(resetPasswordSchema), async(req,res)=>{
    let data = await resetPassword(req.body);
    return SuccessResponse({res, message: 'Password Reset Successfully , Login With Your New Password', status: 200 , data})
})
export default router;