import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

//以下が初期設定
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});
console.log(process.env.NODE_ENV);
let upload;

if (process.env.NODE_ENV === "production") {
//s3に保存するようにしたい
upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        metadata: function(req,file,cb){
            cb(null, {fieldName: file.fieldname });
        },
        key: function(req,file,cb){
            cb(null, file.originalname || new Date().toISOString()+ "." + file.mimetype);
        }
    })
});
}else{
// //multerの初期化。destinationとfilenameを設定する
upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'frontend/assets/images/');//保存先を決める。サーバー側の設定なので、クライアント側からのリクエストのパスとは違う
        },
        filename: function (req, file, cb){
            cb(null, file?.originalname);//ファイル名を決める（送られてきたファイル名をそのまま）
        }
    })
});
}

export const uploadMiddleware = upload.single("product_image");