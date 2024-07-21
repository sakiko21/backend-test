import { 
    register,
    changePassword,
    updateUser,
    deleteUser,
    login,
    account
} from "../api/user/index.js";

import { userAuthentication } from "../middleware/index.js";
//トップページ、利用規約、お問い合わせなどを入れる想定
export function userRouter(app){
    //ユーザー情報のAPI
app.post("/user/register", register);//12行目のapp.use(express.json());をかかないとbodyの中にデータが入らないので、必ずそのコードよりは下に書くこと

app.post("/user/change-password", changePassword);//パスワードを変更するAPI

app.put("/user/update", updateUser);//ユーザー情報を更新するAPI


app.delete("/user/delete", deleteUser);//ユーザー情報を削除するAPI

app.post("/login", login );

app.get("/user/account", userAuthentication, account);//ユーザー情報を取得するAPI
}