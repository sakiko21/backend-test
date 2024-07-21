import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';//パスワードをハッシュ化するためのライブラリ

export async function register(req, res) {// データの登録は非同期通信なので、会員登録終わってからレスポンスを返す。なのでasyncをつける
    console .log(req.body);//これで疎通確認しOK。
    //const body = req.body;
    //const user = await backendpracDB.createUser(body.name, body.email, body.password);いちいちbody.nameとか書くのは面倒なので、上を変える
    const { name, email, password} = req.body; //req.bodyの中身を直接取り出す
    console.log(name, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);//パスワードをハッシュ化する。第一引数にはパスワード、第二引数にはハッシュ化の強度を指定する。10が一般的
    const user = await backendpracDB.createUser(name, email, hashedPassword);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);//thriw new Errorでエラーを投げると、処理が止まるので、returnで返す
    }
    res.status(200).send(user)
}