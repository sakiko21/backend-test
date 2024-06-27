import express from "express"; //モジュールの場合はこの書き方。

const app = express();//Expressという関数を実行したやつをapp変数の中に入れる。慣習的に
const PORT = 3000;
//node indexjsを実行すればコードは動くが、実際にはURL入力した時にコードが動いてほしい。サーバを起動してリクエストがアタ時にレスポンス返せる状態にしておかないといけない→listen
app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});//パスなしのURlにアクセスすると、HelloWorldとかえす

app.get("/users", (req, res) => {
    res.send("<h1>Users Path</h1>")
});

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});//サーバーを起動する。サーバーにはドメインとポート番号が必要。ドメインはローカルホスト（ドメイン）、ポート番号は第一引数へ、第二引数にはコールバック関数

//リクエストの受付用にルーティングをする