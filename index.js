import express from "express"; //モジュールの場合はこの書き方。
import dotenv from "dotenv";//dotenvを読み込むにはモジュール必要
dotenv.config();//dotenvconfigで宣言すると、envファイル内の変数をprocess.envに全て格納してくれる。index
import { backendpracDB } from "./backendprac-db.js";//初期化を実行したいので、サーバーを起動した時に初期化を実行させたい
backendpracDB.init();//initすれば初期化実行し、テーブルの有無を見る
import bcrypt from "bcryptjs";//パスワードをハッシュ化するためのモジュール

const app = express();//Expressという関数を実行したやつをapp変数の中に入れる。慣習的に
const PORT = 3000;
//node indexjsを実行すればコードは動くが、実際にはURL入力した時にコードが動いてほしい。サーバを起動してリクエストがアタ時にレスポンス返せる状態にしておかないといけない→listen

app.use(express.json());//これを書くとbodyの中にjsonを格納する（これしないとbodyの中にデータが入らない？
//カッコの中の処理を行なって、レスポンス返したり処理終了するのではなく、引き続き次を見に行きますよというもの。実際にやりたい処理とリクエストの間に処理を挟むなどミドルウェアを動かす時に使う

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});//パスなしのURlにアクセスすると、HelloWorldとかえす

//app.get("/users", (req, res) => {
//    res.send("<h1>Users Path</h1>")
//});

//ユーザー情報のAPI
app.post("/user/register", async(req, res) => {// データの登録は非同期通信なので、会員登録終わってからレスポンスを返す。なのでasyncをつける
    console .log(req.body);//これで疎通確認しOK。
    //const body = req.body;
    //const user = await backendpracDB.createUser(body.name, body.email, body.password);いちいちbody.nameとか書くのは面倒なので、上を変える
    const { name, email, password} = req.body; //req.bodyの中身を直接取り出す
    console.log(name, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);//パスワードをハッシュ化する。第一引数にはパスワード、第二引数にはハッシュ化の強度を指定する。10が一般的
    const user = await backendpracDB.createUser(name, email, hashedPassword);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);//thriw new Errorでエラーを投げると、処理が止まるので、returnで返す
    }
    res.status(200).send(user)
});//12行目のapp.use(express.json());をかかないとbodyの中にデータが入らないので、必ずそのコードよりは下に書くこと

app.post("/user/change-password", async(req, res) => {
    const { id, oldPassword, newPassword} = req.body;
    console.log({id, oldPassword, newPassword});
    const user = await backendpracDB.getUserById(id);
    console.log({user});
    if (user?.error){
        return res.status(500).send(user.error);
    }
    if (!user){
        return res.status(404).send('ユーザーが見つかりません');
    }
    // 現在のパスワードが正しいか確認
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send('現在のパスワードが一致しません');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const changedPassUser = await backendpracDB.changePassword(id, hashedNewPassword);
    console.log(changedPassUser);
    if (changedPassUser.error){
        return res.status(500).send(changedPassUser.error);
    }
    res.status(200).send(user);
});//パスワードを変更するAPI

app.put("/user/update", async(req, res) => {
    const { id, name, email} = req.body;
    console.log({id, name, email});
    const user = await backendpracDB.updateUser(id, name, email);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);
    } 
    res.status(200).send(user);
});//ユーザー情報を更新するAPI
app.delete("/user/delete", async(req, res) => {
    const { id } = req.body;
    console.log({id});
    const user = await backendpracDB.deleteUser(id);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);
    }
    res.status(200).send(user);
}
);//ユーザー情報を削除するAPI

app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    const user = await backendpracDB.getUser(email);
    console.log({user});//(user)でなく、{user}でオブジェクトとして表示される
    if (user?.error){//これは、エラーがある場合の処理
        return res.status(500).send(user.error);//もしpgのエラーがある場合などは、500番のエラーを返す
    }
    if (!user){
    res.res.status(401).send('ユーザーが一致しません');
    }
    const isMuch = await bcrypt.compare(password, user.password);//入力したパスワードをハッシュ化したものと、ハッシュ化したパスワードを比較し一致していたらデータを返す
    if (!isMuch){
        return res.status(401).send('パスワードが一致しません');
    }

    return res.status(200).send(user);
});
//商品情報のAPI
app.post("/product/create", async(req, res) => {
    const { title, description, price, image_path} = req.body;
    console.log({title, description, price, image_path});//これでデータが取れているか確認。{}で囲むとオブジェクトとして表示される
    const product = await backendpracDB.createProduct(
        title, 
        description, 
        price, 
        image_path
    );
    if (product.error){
        return res.status(500).send(product.error);
    }
    res.status(200).send(product);
});//商品登録の処理を書く

app.get("/products", async(req, res) => {
    const products = await backendpracDB.getProducts();
    console.log(products);
    res.status(200).send(products);
});//商品情報を取得するAPI 
app.get("/product/:id", async(req, res) => {//getの場合、URLを使って情報を取得する方法とクエリパラメータを使って情報を取得する方法がある。:idという書き方をすると、idは動的に変わる値を取得することができる
    const { id } = req.params;//req.paramsでidを取得する
    console.log({id});
    const product = await backendpracDB.getProduct(id);
    console.log({product});
    if (product.message){
        return res.status(200).send(product.message);
    } else if (product.error){
        return res.status(500).send(product.error);
    }
    res.status(200).send(product);
} );//商品情報を取得するAPI

app.put("/product/update", async(req, res) => {
    const { id, title, description, price, image_path } = req.body;
    console.log({id, title, description, price, image_path});
    const product = await backendpracDB.updateProduct(id, title, description, price, image_path);
    console.log(product);
    if  (product.message){
        return res.status(200).send(product.message);
    } else if (product.error){
        return res.status(500).send(product.error);
    }
    res.status(200).send(product);
});//商品情報を更新するAPI
app.delete("/product/delete", async(req, res) => {
    const { id } = req.body;
    console.log({id});
    const product = await backendpracDB.deleteProduct(id);
    console.log(product);
    if (product.message){
        return res.status(200).send(product.message);
    } else if (product.error){
        return res.status(500).send(product.error);
    }
    res.status(200).send(product);
});//商品情報を削除するAPI

app.post("/purchase/create", async(req, res) => {
    const { user_id, amount, product_ids } = req.body;
    console.log({user_id, amount, product_ids});
    const purchase = await backendpracDB.createPurchase(user_id, amount, product_ids);
    console.log(purchase);
    if (purchase.error){
        return res.status(500).send(purchase.error);
    }
    res.status(200).send(purchase);
}
);//購入情報を登録するAPI

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});//サーバーを起動する。サーバーにはドメインとポート番号が必要。ドメインはローカルホスト（ドメイン）、ポート番号は第一引数へ、第二引数にはコールバック関数

//リクエストの受付用にルーティングをする