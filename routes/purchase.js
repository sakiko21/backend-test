import { createPurchase } from "../api/purchase/index.js";
//トップページ、利用規約、お問い合わせなどを入れる想定
export function purchaseRouter(app){
    app.post("/purchase/create", createPurchase);//購入情報を登録するAPI
}