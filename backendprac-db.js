//dbにアクセスする機能を開発。node.jsをpostgresに接続するにはpgを使う。データベースに接続するためのファイルを作成。postgresに接続するための関数と価格
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config(); // .envファイルを読み込む



//export const backendpracDB = { //外部ファイルのため、indexで呼び出すためにexportで宣言。いろんな機能をまとめて作りたいのでconst ..DBをオブジェクトとして宣言。そうすることで
    //connect: () => {//コネクトのきのうを作ったり
    //},
    //createTable: () => {//creafteテーブルの機能を作ったり、
    //}
    //connect:async() => {
        //const client = new pg.Pool({
        const pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,//接続先として、const connectionString = "postgres://user:pass@DBのアドレス:ポート/DB名"。ここに書くとuserpassなど個人情報他人に見られるとまずいので、環境変数に入れる。
            ssl: false
        });
        //await client.connect();//接続を実行するためのコネクト関数を実行
        //return client;//接続終わったpostgresの情報を返す
    //},
    export const backendpracDB ={
    init: async() => {
        //const client = await backendpracDB.connect();
        const client = await pool.connect();
        try{
        const hasUsersTable = await client.query(
            `SELECT EXISTS(
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'users'
            );`
        );
        if (!hasUsersTable.rows[0].exists){
            console.log('ユーザーテーブル作成');
            //emailは一位にする
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
        const hasProductsTable = await client.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'products'
            );`
        );
        if (!hasProductsTable.rows[0].exists){
            console.log('プロダクトテーブル作成');
            await client.query(`
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description text,
                    price INTEGER NOT NULL,
                    image_path VARCHAR(255),
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
        const hasPurchaseTable = await client.query(
            `SELECT EXISTS(
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'purchase'
            );`
        );
        if (!hasPurchaseTable.rows[0].exists){
            console.log('purchaseテーブル作成')
            await client.query(`
                CREATE TABLE purchase (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                    amount INTEGER NOT NULL,
                    product_ids INTEGER[] NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    } finally {
        client.release();
    }
    },//初期化。→これからユーザーテーブルや購入の登録などしていく。もしユーザテーブルなければ作る。テーブルあるかどうかのチェックをし、なければ作りに行く。これはテーブルの初期化作業を行いたい。テーブルできていないとデータ保存時にエラーになるので
    createUser: async (name, email, password) => {
        //エラーハンドリングを書く
            try{
            //const client = await backendpracDB.connect();
            const user = await backendpracDB.getUser(email);
            console.log('getUserの結果:', user);
            if (user && !user.message){
                return { error: 'このメールアドレスは既に登録されています' };
            }else{
            //const result = await client.query(
            const result = await pool.query(
                `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
                [name, email, password]
            );
            return result.rows[0];
            }  
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    getUser: async (email) => {
        try{
            //const client = await backendpracDB.connect();
            //const result = await client.query(
            const result = await pool.query(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );
            return result.rows[0]|| {message: 'ユーザーが見つかりません'};//userが見つからない場合、エラーを返す
            // return result.rows[0]|| null;
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        } 
    },
    updateUser: async (id, name, email) => {
        //const client = await backendpracDB.connect();
        try{
            //const userResult = await client.query(
            const userResult = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [id]
            ); 
            if(!userResult.rows[0]){
                return { error: 'ユーザーが見つかりません' };
            }
            const updateResult = await client.query(
                `UPDATE users SET name = $2, email = $3 WHERE id = $1 RETURNING *`,
                [id, name, email]
            );
            return updateResult.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    deleteUser: async (id) => {
        //const client = await backendpracDB.connect();
        try{
            //const userResult = await client.query(
            const userResult = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [id]
            );
            if(!userResult.rows[0]){
                return { error: 'ユーザーが見つかりません' };
            }
            
            //const deleteResult = await client.query(
            const deleteResult = await pool.query(
                `DELETE FROM users WHERE id = $1 RETURNING *`,
                [id]
            );
            return deleteResult.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        } 
    },
    changePassword: async ( id, hashedNewPassword) => {
        //const client =await backendpracDB.connect();
        try{
            //const updateResult = await client.query(
            const updateResult = await pool.query(
                `UPDATE users SET password = $2 WHERE id = $1 RETURNING *`,
                [ id, hashedNewPassword]
            ); 
            return updateResult.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        } 
    },
    createProduct: async (title, description, price, image_path) => {
        try{
            //const client = await backendpracDB.connect();
            const result = await pool.query(
                `INSERT INTO products (title, description, price, image_path) VALUES ($1, $2, $3, $4) RETURNING *`,
                [title, description, price, image_path]
            );
            return result.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    getProducts: async () => {
        try{
            //const client = await backendpracDB.connect();
            //const result = await client.query(
            const result = await pool.query(
                `SELECT * FROM products`
            );
            return result.rows;//一個もデータない場合は空の配列が返る
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    getProduct: async (id) => {
        //const client = await backendpracDB.connect();
        try{  
            //const result = await client.query(
            //const result = await client.query(
            const result = await pool.query(
                `SELECT * FROM products WHERE id = $1`,
                [id]
            );
            return result.rows[0] || { message: '商品が見つかりません' };
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    updateProduct: async (id, title, description, price, image_path) => {
        //const client = await backendpracDB.connect();
        try{
            //const productResult = await client.query(
            const productResult = await pool.query(
                `SELECT * FROM products WHERE id = $1`,
                [id]
            );
            if(!productResult.rows[0]){
                return { error: '商品が見つかりません' };
            }
            //const updateResult = await client.query(
            const updateResult = await pool.query(
                `UPDATE products SET title = $2, description = $3, price = $4, image_path = $5 WHERE id = $1 RETURNING *`,
                [id, title, description, price, image_path]
            );
            return updateResult.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    deleteProduct: async (id) => {
        //const client = await backendpracDB.connect();
        try{
            //const productResult = await client.query(
            const productResult = await pool.query(
                `SELECT * FROM products WHERE id = $1`,
                [id]
            );
            if(!productResult.rows[0]){
                return { error: '商品が見つかりません' };
            }
            //const deleteResult = await client.query(
            const deleteResult = await pool.query(
                `DELETE FROM products WHERE id = $1 RETURNING *`,
                [id]
            );
            return deleteResult.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
        
    },
    createPurchase: async (user_id, amount, product_ids) => {
        //const client = await backendpracDB.connect();
        try{
            //const result = await client.query(
            const result = await pool.query(
                `INSERT INTO purchase (user_id, amount, product_ids) VALUES ($1, $2, $3) RETURNING *`,
                [user_id, amount, product_ids]
            );
            return result.rows[0];
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    getPurchase: async (user_id) => {
        //const client = await backendpracDB.connect();
        try{
            const result = await pool.query(
                `SELECT * FROM purchase WHERE user_id = $1`,
                [user_id]
            );
            return result.rows;
            } catch(error) {
                console.log(error);
                return { error: '不明なエラーが発生しました' };
            }
    },
    
};

//backendpracDB.connect();//使い方の例
//backendpracDB.createTable();//使い方の例

