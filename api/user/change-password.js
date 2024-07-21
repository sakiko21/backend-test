import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';

export async function changePassword(req, res) {
    //ユーザーは{email, oldPassword, newPassword}を送信する
    const { email, oldPassword, newPassword} = req.body;
    console.log({email, oldPassword, newPassword});
    //getUserを呼び出し、データベースからemailに一致するユーザーを取得
    const user = await backendpracDB.getUser(email);
    console.log({user});
    //ユーザー情報にエラーが含まれている場合の処理。
    //userがnullやundefinedでも安全にerrorプロパティを参照するために、オプショナルチェイニング（?.）を使っている
    if (user?.error){
        return res.status(500).send(user.error);
    }
    //ユーザーが見つからない場合の処理
    if (!user){
        return res.status(404).send('ユーザーが見つかりません');
    }
    // 現在のパスワードが正しいか確認
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send('現在のパスワードが一致しません');
    }
    //新しいパスワードをハッシュ化
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    //パスワードを変更
    const changedPassUser = await backendpracDB.changePassword(user.id, hashedNewPassword);
    console.log(changedPassUser);
    if (changedPassUser.error){
        return res.status(500).send(changedPassUser.error);
    }
    res.status(200).send(changedPassUser);
}