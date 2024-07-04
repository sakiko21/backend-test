//dbにアクセスする機能を開発。node.jsをpostgresに接続するにはpgを使う。データベースに接続するためのファイルを作成。postgresに接続するための関数と価格
import pg from "pg";
export const backendpracDB = { //外部ファイルのため、indexで呼び出すためにexportで宣言。いろんな機能をまとめて作りたいのでconst ..DBをオブジェクトとして宣言。そうすることで
    //connect: () => {//コネクトのきのうを作ったり
    //},
    //createTable: () => {//creafteテーブルの機能を作ったり、
    //}
    connect:async() => {
        const client = new pg.Pool({
            connectionString: process.env.DATABASE_URL,//接続先として、const connectionString = "postgres://user:pass@DBのアドレス:ポート/DB名"。ここに書くとuserpassなど個人情報他人に見られるとまずいので、環境変数に入れる。
            ssl: false
        });
        await client.connect();//接続を実行するためのコネクト関数を実行
        return client;//接続終わったpostgresの情報を返す
    },
    init: async() => {
        const client = await backendpracDB.connect();
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
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    amount INTEGER NOT NULL,
                    product_ids INTEGER[] NOT NULL,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    },//初期化。→これからユーザーテーブルや購入の登録などしていく。もしユーザテーブルなければ作る。テーブルあるかどうかのチェックをし、なければ作りに行く。これはテーブルの初期化作業を行いたい。テーブルできていないとデータ保存時にエラーになるので
    createUser: async (name, email, password) => {
        //エラーハンドリングを書く
            try{
            const client = await backendpracDB.connect();
            const user = await backendpracDB.getUser(email);
            if (user){
                return { error: 'このメールアドレスは既に登録されています' };
            }else{
            const result = await client.query(
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
            const client = await backendpracDB.connect();
            const result = await client.query(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );
            return result.rows[0]|| {message: 'ユーザーが見つかりません'};//userが見つからない場合、エラーを返す
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        } 
    },
    updateUser: async (id, name, email, password) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1 RETURNING *`,
            [id, name, email, password]
        );
        return result.rows[0];
    },
    deleteUser: async (id) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `DELETE FROM users WHERE id =$1`,
            [id]
        );
        return { message: `ID ${id} を削除しました` };
    },
    createProduct: async (title, description, price, image_path) => {
        try{
            const client = await backendpracDB.connect();
            const result = await client.query(
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
            const client = await backendpracDB.connect();
            const result = await client.query(
                `SELECT * FROM products`
            );
            return result.rows;//一個もデータない場合は空の配列が返る
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    getProduct: async (id) => {
        try{
            const client = await backendpracDB.connect();
            const result = await client.query(
                `SELECT * FROM products WHERE id = $1`,
                [id]
            );
            return result.rows[0] || { message: '商品が見つかりません' };
        } catch (error){
            console.log(error);
            return { error: '不明なエラーが発生しました' };
        }
    },
    updateProducts: async (id, title, description, price, image_path) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `UPDATE products SET title = $2, description = $3, price = $4, image_path = $5 WHERE id = $1 RETURNING *`,
            [id, title, description, price, image_path]
        );
        return result.rows[0];
    },
    deleteProducts: async (id) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `DELETE FROM products WHERE id =$1`,
            [id]
        );
        return { message: `商品ID ${id} を削除しました` };
    },
    createPurchase: async (user_id, amount, product_ids) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `INSERT INTO purchase (user_id, amount, product_ids) VALUES ($1, $2, $3) RETURNING *`,
            [user_id, amount, product_ids]
        );
        return result.rows[0];
    },
    getPurchase: async (user_id) => {
        const client = await backendpracDB.connect();
        const result = await client.query(
            `SELECT * FROM purchase WHERE user_id = $1`,
            [user_id]
        );
        return result.rows;
    },
    
};

//backendpracDB.connect();//使い方の例
//backendpracDB.createTable();//使い方の例