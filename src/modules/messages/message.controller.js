import  Router  from "express";
import { deleteMessage, getAllMessages, getMessageById, sendMessage } from './message.service.js';
import { SuccessResponse } from "../../common/utils/responses/index.js";
import { auth, extensions, upload, validation} from '../../common/middleware/index.js';
import { sendMessageSchmea} from './message.validation.js';

const router = Router();

router.post('/send-message/:recieverID' , upload({customPath: 'image/users/images' , allowedExtensions: extensions.image}).single('image') , validation(sendMessageSchmea) , async (req,res)=>{
    let message = await sendMessage(req.params , req.body , req.file);
    SuccessResponse({res , message: "message added successfully" , status: 201 , data: message});
})


router.get('/get-all-messages', auth , async(req,res)=>{
    let messages = await getAllMessages(req.userId);
    SuccessResponse({res , message: "message fetched successfully" , status: 200, data: messages});
})

router.get('/get-message-by-id/:id', auth , async(res,req)=>{
    let message = await getMessageById( res.userId , req.params.id);
    SuccessResponse({res, message: "message fetcehd successfullly", status: 200, data:message});
})


router.delete('/delete-message/:id' , auth , async(req,res)=>{
    let deletedMessage = await deleteMessage(req.userId , req.params.id);
    SuccessResponse({res , message: "message deleted successfully" , status:200, data: deletedMessage});
})

export default router;2