import express from "express"; //モジュールの場合はこの書き方。

const app = express();//Expressという関数を実行したやつをapp変数の中に入れる。
const PORT = 3000;
//node indexjsを実行すればコードは動くが、実際にはURL入力した時にコードが動いてほしい。サーバを起動してリクエストがアタ時にレスポンス返せる状態にしておかないといけない→listen
app.get("/", (req, res) => {
    res.send("Hello World!");
});//パスなしのURlにアクセスすると、HelloWorldとかえす

app.listen(PORT, () =>{
    console.log("Server running on port ${PORT}");
});//サーバーを起動する