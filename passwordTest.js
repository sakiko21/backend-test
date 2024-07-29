//node passwordTest.js コマンドで、確認ができる

import bcrypt from 'bcryptjs';

const storedHashedPassword = '$2a$10$xEbMaXB2p5nqGghyu1PwNeanHio28G66.BbGB09txmJ0zp5IK9QJq'; // データベースから取得したハッシュ化パスワード
const inputPassword = 'test1'; // ユーザーが入力したパスワード

bcrypt.compare(inputPassword, storedHashedPassword, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err);
    } else {
        console.log('Password match result (manual compare):', isMatch);
    }
});
