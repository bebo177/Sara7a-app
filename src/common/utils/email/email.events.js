import { EventEmitter } from "events";
import { generateHash} from "../../hashing/hash.js";
import { redisKey} from "../../../modules/auth/auth.service.js";
import { set } from "../../../database/redis.service.js";
import { sendEmail} from "./sendEmail.js";

export let event = new EventEmitter();

export function createOTP(){
    let code = Math.floor(Math.random()* 1000000)
    code = code.toString().padStart(6,"0");
    return code;
}

event.on("verifyEmail", async(data)=>{
    let {userId , email , userName} = data;
    let code = createOTP();
    await set({
        key: redisKey("OTP",userId),
        value: await generateHash(code),
        ttl: 5 * 60
    })
    await sendEmail({
        to: email,
        subject: "user registerd successfully please verify ur email",
        html:`<h1>Hello: ${userName}</h1>
        <p> ur OTP is :${code} </p>
        <p> Note: this OTP is valid for 5 min</p>
        `
    });
})


event.on("Confirmation", async({email , userName})=>{
    await sendEmail({
        to: email,
        subject: "email verified successfully",
        html: `<h1>Hello: ${userName}</h1>
        <p> ur acount is verified via OTP </p>`
    })
})



event.on("toogle", async(user)=>{
    let code = createOTP();
    await set ({
        key: redisKey("25V",user._id),
        value: await generateHash(code),
        ttl: 5* 60
    })
    await sendEmail({
        to: user.email,
        subject: user.twoStepVerfication ? "Disable Two Step Verification" : "Enable Two Step Verification",
        html: `<h1>Hello: ${user.userName}</h1>
        <p> ur OTP is: ${code}</p>
        <p>Note: this OTP is valid for 5 min </p>`
    })
})



event.on("verifyTwoStep", async(user)=>{
    let message = user.twoAtepVerfication ? " Two Step Verification Enabled Successfully": " Two Step Verification Disabled Successfully";
    await sendEmail({
        to: user.email,
        subject: "twoStepVerfication State",
        html: `<h1>Hello: ${user.userName}</h1>
        <p> ${message}</p>`
    })
})


event.on("twoStepLogin", async(user)=>{
    let OTP = createOTP();
    await set({
        key: redisKey("OTP::login",user.email),
        value: await generateHash(OTP),
        ttl: 5 * 60
    })
    await sendEmail({
        to: user.email,
        subject: "Login With Two Step Verfication",
        html: `<h1>Hello: ${user.userName}</h1>
            <p> please use this otp to login: ${OTP} </p>
        <p>Note: this otp is valid for 5 minutes</p>
        `
    })
})


event.on("twoStepLoginVerify", async(user)=>{
    await sendEmail({
        to: user.email,
        subject: "User Logined With Two Step Verfication Successfully",
        html: `<h1>Hello: ${user.userName}</h1>
            <p>you are now logged in successfully with two step verification</p>
        `
    })
})



event.on("forgotPassword", async(user)=>{
    let OTP = createOTP();
    await set({
        key: redisKey("OTP::reset",user.email),
        value: await generateHash(OTP),
        ttl: 5 * 6
    })

    await sendEmail({
        to: user.email,
        subject: "Reset Password With OTP",
        html: `<h1>Hello ${user.userName}</h1>
            <p> please use this otp to reset your password: ${OTP}</p>
        <p>Note: this otp is valid for 5 minutes</p>
      `
    })
})

event.on("resetPassword", async(user)=>{
    await sendEmail({
        to: user.email,
        subject: "Password Reset Successfully With OTP",
        html: `<h1>Hello: ${user.userName}</h1>
            <p>Password Reset Successfully , Login With Your New Password</p>
        `
    })
})