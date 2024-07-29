import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
    const {email, password} = req.body;
    console.log(email, password);
    const user = await backendpracDB.getUser(email);
    console.log("user:", {user});//(user)でなく、{user}でオブジェクトとして表示される
    if (user?.error){//これは、エラーがある場合の処理
        return res.status(500).send(user.error);//もしpgのエラーがある場合などは、500番のエラーを返す
    }
    if (!user){
    return res.status(401).send('ユーザーが一致しません');
    }
    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);//入力したパスワードをハッシュ化したものと、ハッシュ化したパスワードを比較し一致していたらデータを返す
    console.log('Password match result:', isMatch);

    if (!isMatch){
        return res.status(401).send('パスワードが一致しません');
    }
    delete user.password;//下で、パスワードを除いたユーザー情報を渡したいので、パスワードを削除する
    const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1d'}); //第一引数にはトークン化したいデーター、第二引数には秘密鍵、第三引数にはオプション有効期限
        res.cookie ('user_token', token, { //res.cookie　とやればクッキー付与できる
            httoOnly: true, //セキュリティの脆弱性解除。フロント側からトークン盗まれることがなくなる。セッショントークンよりは、こちらの方が安全
            secure: process.env.NODE_ENV === 'production', //httpでなくhttpsにだけクッキー付与する
            maxAge: 1000 * 60 * 60 * 24,
        });//フロントとバックエンドが同じサイトでないとクッキーを付与しない、とするとよりセキュリティ高くなる
    return res.status(200).redirect('/users/account');

}