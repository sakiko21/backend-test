import express from "express"; //モジュールの場合はこの書き方。
import dotenv from "dotenv";//dotenvを読み込むにはモジュール必要
dotenv.config();//dotenvconfigで宣言すると、envファイル内の変数をprocess.envに全て格納してくれる。index
import { backendpracDB } from "./backendprac-db.js";//初期化を実行したいので、サーバーを起動した時に初期化を実行させたい
backendpracDB.init();//initすれば初期化実行し、テーブルの有無を見る
import bcrypt from "bcryptjs";//パスワードをハッシュ化するためのモジュール
import jwt from "jsonwebtoken";//JWTを使うためのモジュール
import { 
    userAuthentication 
} from "./middleware/index.js"; //ユーザー認証を行うためのミドルウェアなどインポート
import {
    productRouter,
    userRouter,
    purchaseRouter
} from "./routes/index.js";//ルーターをインポート

import serveStatic from "serve-static";
//import fs from "fs";//ファイルの中身を読み取るモジュール。
import {readFileSync} from "fs";//readFileSyncの関数だけとってこれば良いので、
//import { join } from "path"; //パスを連結するためのモジュール
import path from "path";
import cookieParser from "cookie-parser";


const app = express();//Expressという関数を実行したやつをapp変数の中に入れる。慣習的に
const PORT = 3000;
//node indexjsを実行すればコードは動くが、実際にはURL入力した時にコードが動いてほしい。サーバを起動してリクエストがアタ時にレスポンス返せる状態にしておかないといけない→listen

app.use(express.json());//これを書くとbodyの中にjsonを格納する（これしないとbodyの中にデータが入らない？
//カッコの中の処理を行なって、レスポンス返したり処理終了するのではなく、引き続き次を見に行きますよというもの。実際にやりたい処理とリクエストの間に処理を挟むなどミドルウェアを動かす時に使う
//publicRouter(app);//↑が先に実行されないと、ボディで送られてきたデータを受け取れないので、publicRouterはその下に
app.use(cookieParser());
userRouter(app);
productRouter(app);
purchaseRouter(app);



const STATIC_PATH = `${process.cwd()}/frontend`;//process.cwdでルートディレクトリのパスを作ってくれる。ルートディレクトリから見てfrontendというディレクトリにアクセスします、と書きたい
//app.use(serveStatic("frontend", {index: ["index.html"]}));//静的ファイルはフロントエンドにアクセスする、ローカルならこの書き方でも良いが、デプロイした後だとこの書き方だとまずいので、、↑


// /products/product/:id ルートで共通のテンプレートを提供
app.get("/products/product/:id", (req, res) => {
    res.sendFile(path.join(STATIC_PATH, "products/product.html"));
});



app.use(serveStatic(STATIC_PATH, {index: ["index.html"]}));

// app.get("/", (req, res) => {
//     const contentHtml = readFileSync(STATIC_PATH + "/index.html", "utf8"); //fs.readFileSync関数を使うと、このファイルを取得できる。第一引数がパス。文字コードが第二引数
//     //readFileSync使うと、関数にasync awaitつけなくても、readFileSyncで読み込みを待ってから、次の処理に進める。ちなみに、readFile を使用した場合には、asyncawaitが必要
//     res
//         .status(200)
//         .setHeader("Content-Type", "text/html")
//         .send(contentHtml);
// })
// //以下でも表示されるんだが、ページごとにルーティング作るの大変。ReactならSPAなのでこのやり方でも良いが、普通にディレクトr構造作りたい場合にはまずい
// //APIのエンドポイント合致しなければ全て静的ファイルであると判断させたい
// app.get("/user/new", (req,res) => {
//     const contentHtml = readFileSync(STATIC_PATH + "/user/new.html", "utf8"); //fs.readFileSync関数を使うと、このファイルを取得できる。第一引数がパス。文字コードが第二引数
//     res
//         .status(200)
//         .setHeader("Content-Type", "text/html")
//         .send(contentHtml);
// })

app.get("/*", (req, res) => {
    try{
        const originalUrl = req.originalUrl;//originaUrlをを使うことで、パスを取得できる。
        const contentHtml = readFileSync(STATIC_PATH + originalUrl + ".html", "utf8"); //パス名とディレクトリ名がを一致させれば、良い
        res
            .status(200)
            .setHeader("Content-Type", "text/html")
            .send(contentHtml);
    } catch(error){
        res.status(404).send("ページが見つかりません");
    }
});


app.get('/favicon.ico', (req, res) => res.status(204));




//app.get("/users", (req, res) => {
//    res.send("<h1>Users Path</h1>")
//});

// app.listen(PORT, () =>{
//     console.log(`Server running on port ${PORT}`);

 app.listen(process.env.PORT, () =>{
     console.log(`Server running on port ${process.env.PORT}`);
     
});//サーバーを起動する。サーバーにはドメインとポート番号が必要。ドメインはローカルホスト（ドメイン）、ポート番号は第一引数へ、第二引数にはコールバック関数

//リクエストの受付用にルーティングをする
