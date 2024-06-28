//dbにアクセスする機能を開発。node.jsをpostgresに接続するにはpgを使う。データベースに接続するためのファイルを作成。postgresに接続するための関数と価格
import pg, { DatabaseError } from "pg";
export const backendpracDB = { //外部ファイルのため、indexで呼び出すためにexportで宣言。いろんな機能をまとめて作りたいのでconst ..DBをオブジェクトとして宣言。そうすることで
    //connect: () => {//コネクトのきのうを作ったり
    //},
    //createTable: () => {//createテーブルの機能を作ったり、
    //}
connect:async() => {
    const client = new pg.Pool({
        conectionString: process.env.DATABASE_URL,
        ssl: false
    })
}


};

//backendpracDB.connect();//使い方の例
//backendpracDB.createTable();//使い方の例