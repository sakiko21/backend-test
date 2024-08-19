import { 
    createPurchase,
    getPurchase
 } from "../api/purchase/index.js";
import { 
    userAuthentication
 } from "../middleware/index.js";

export function purchaseRouter(app){
    app.post("/purchase/create", userAuthentication, createPurchase);//購入情報を登録するAPI
    app.get("/purchase/get", userAuthentication, getPurchase);
}