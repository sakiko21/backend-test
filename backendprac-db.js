//dbにアクセスする機能を開発。node.jsをpostgresに接続するにはpgを使う。データベースに接続するためのファイルを作成。postgresに接続するための関数と価格
import pg, { DatabaseError } from "pg";
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
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
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
    createUser:async (name, email, password) => {
        const client = await client.query()
    }
    
};

//backendpracDB.connect();//使い方の例
//backendpracDB.createTable();//使い方の例