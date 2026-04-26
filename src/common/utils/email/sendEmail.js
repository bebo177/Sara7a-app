import nodemailer from 'nodemailer';
import { AppEmail, AppPassword} from '../../../../config/index.js';


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: AppEmail,
        pass: AppPassword,
    },
});


export const sendEmail = async ({
    to , 
    subject ,
    html
} = {}) =>{
    const info = await transporter.sendMail({
        from:`"Sara7a App" <${AppEmail}`,
        to,
        subject,
        html
    });
    
    console.log("Message sent:", info.messageId);
}