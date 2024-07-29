import { backendpracDB } from '../../backendprac-db.js';
import bcrypt from 'bcryptjs';//パスワードをハッシュ化するためのライブラリ
import jwt from 'jsonwebtoken';

export async function logout(req, res) {
    try {
        res.cookie('user_token', '', { maxAge: 0 }); // クッキーを無効化
        res.status(200).send('Logged out');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Logout failed');
    }
}
