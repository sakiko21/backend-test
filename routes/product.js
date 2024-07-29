import { 
    createProduct,
    getAllProducts,
    product,
    updateProduct,
    deleteProduct
} from "../api/product/index.js";

import { userAuthentication } from "../middleware/index.js";
//トップページ、利用規約、お問い合わせなどを入れる想定
import multer from "multer";

//multerの初期化。destinationとfilenameを設定する
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'frontend/assets/images/');//保存先を決める
        },
        filename: function (req, file, cb){
            cb(null, file?.originalname);//ファイル名を決める（送られてきたファイル名をそのまま）
        }
    })
});

export function productRouter(app){
    //商品情報のAPI
app.post("/product/create", userAuthentication, upload.single("product_image"), createProduct);//商品登録の処理を書く。ログインチェック後に、画像を保存させ、データベースに画像を保存させたい
// 画像一つの場合はupload.single。
//name属性を"product_image"に指定


app.get("/products", getAllProducts);//商品情報を取得するAPI 

app.get("/product/:id", product);//getの場合、URLを使って情報を取得する方法とクエリパラメータを使って情報を取得する方法がある。:idという書き方をすると、idは動的に変わる値を取得することができる
//商品情報を取得するAPI

app.put("/product/update", updateProduct);//商品情報を更新するAPI

app.delete("/product/delete", deleteProduct);//商品情報を削除するAPI

}