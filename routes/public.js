//トップページ、利用規約、お問い合わせなどを入れる想定
export function publicRouter(app){
    app.get("/", (req, res) => {
        res.send("<h1>Hello World!</h1>");
    });//パスなしのURlにアクセスすると、HelloWorldとかえす
}