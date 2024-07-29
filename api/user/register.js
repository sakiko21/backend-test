import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';//パスワードをハッシュ化するためのライブラリ
import jwt from 'jsonwebtoken';

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

    delete user.password;//下で、パスワードを除いたユーザー情報を渡したいので、パスワードを削除する
    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1d'}); //第一引数にはトークン化したいデーター、第二引数には秘密鍵、第三引数にはオプション有効期限
    res.cookie ('user_token', token, { //res.cookie　とやればクッキー付与できる
        httoOnly: true, //セキュリティの脆弱性解除。フロント側からトークン盗まれることがなくなる。セッショントークンよりは、こちらの方が安全
        secure: process.env.NODE_ENV === 'production', //httpでなくhttpsにだけクッキー付与する
        maxAge: 1000 * 60 * 60 * 24,
    });//フロントとバックエンドが同じサイトでないとクッキーを付与しない、とするとよりセキュリティ高くなる
    return res.status(200).send(user);
}


    