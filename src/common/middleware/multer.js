import multer from 'multer';
import fs from 'node:fs';

export let extentions ={
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    pdf:   ['application/pdf']
}

export const upload = ({customPath = 'general ', allowedExtentions = [] , mazSize = 5}={})=>{
    let storage = multer.diskStorage({
        destination: function(req , file , cb){
            let filePath = `uploads/${customPath}`;
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath,{recursive:true});
            }
            cb(null, filesPath);
        },

        filename: function(req,file,cb){
            let perfix = Date.now();
            let filename = `${perfix}-${file.originalname}`;
            cb(null,filename);
        }
    })

    let fileFilter = function(req,file,cb){
        if (!allowedExtentions.includes(file.mimetype)) {
            return cb(new Error("file type is not allowed"), false);
        }
        cb(null , true);
    }

    return multer({storage , fileFilter , limits:{fileSize: maxSize * 1024 * 1024}})
} 