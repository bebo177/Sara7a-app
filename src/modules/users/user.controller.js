import { Router } from "express";
import { deleteUser, getUserById, getUserDataByLink, getUserProfile, shareProfileLink, updateUser } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/responses/index.js";
import { auth, extentions, upload, validation} from '../../common/middleware/index.js'
import { updateUserSchema, userLinkSchema } from "./user.validation.js";
import { SuccessResponse } from '../../common/utils/responses/success.response';
const router = Router();

router.get('/get-user-by-id',auth , async(req,res)=>{
    let userData = await getUserById(req.userId);
    return SuccessResponse({res,message: "user data retrieved", status:200, data:userData});
})

router.get('/get-user-profile', auth , async(req,res)=>{
    let userData = await getUserProfile(req.userId);
    return SuccessResponse({res, message: "user profile retrieved", status: 200, data: userData});
});

router.get('/share-profile-link', auth , async(req,res)=>{
    let profileLink = await shareProfileLink(req.userId);
    return SuccessResponse({res, message: 'user link retrieved', status:200, data:profileLink});
})

router.get('/get-user-data-by-link', validation(userLinkSchema), async (req,res)=>{
    let userData = await getUserDataByLink(req.body);
    return SuccessResponse({res, message: 'user data retrieved', status: 200, data: userData});
})

router.put('/update-user' , auth , validation(updateUserSchema), upload({customPath:'image/users/profileImage', allowedExtentions: extentions.image}).single('image'), async(req,res)=>{
    let updateData = await updateUser(req.userId,req.body,req.file);
    return SuccessResponse({res, message: 'user updated successfully', status: 200, data: updateData });
})

router.delete('/delete-user', auth, async(req,res)=>{
    let deleteData = await deleteUser(req.userId);
    return SuccessResponse({res, message: 'user deleted successfully', status:200 , data: deleteData});
})

export default router;
