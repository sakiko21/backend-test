import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    const {email, password} = req.body;
    console.log(email, password);
    const user = await backendpracDB.getUser(email);
    console.log({user});//(user)でなく、{user}でオブジェクトとして表示される
    if (user?.error){//これは、エラーがある場合の処理
        return res.status(500).send(user.error);//もしpgのエラーがある場合などは、500番のエラーを返す
    }
    if (!user){
    res.res.status(401).send('ユーザーが一致しません');
    }
    const isMuch = await bcrypt.compare(password, user.password);//入力したパスワードをハッシュ化したものと、ハッシュ化したパスワードを比較し一致していたらデータを返す
    if (!isMuch){
        return res.status(401).send('パスワードが一致しません');
    }
    delete user.password;//下で、パスワードを除いたユーザー情報を渡したいので、パスワードを削除する
    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1d'}); //第一引数にはトークン化したいデーター、第二引数には秘密鍵、第三引数にはオプション有効期限
    return res.status(200).send(token);
}