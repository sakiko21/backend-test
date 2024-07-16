import jwt from "jsonwebtoken";//jwtモジュールをインポート

export async function userAuthentication(req, res, next){
    const {token} = req.body;//リクエストボディからトークンを取得
    if (!token){
        return res.status(401).send("トークンがありません");//トークンがない場合、401エラーを返す
    }
    try{
    const user = jwt.verify(token, process.env.JWT_SECRET);//トークンを検証する。第一引数にはトークン、第二引数には秘密鍵
        console.log({user});
        req.user = user;//リクエストオブジェクトにuserを追加。そこにペイロードのuserを格納
        next();//次の処理に移る
    } catch (error){
        return res.status(500).send(error.message);//エラーがある場合、401エラーを返す
    }
}