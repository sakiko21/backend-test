export async function account(req, res){
    const user = req.user;
    delete user.iat;
    delete user.exp;
    res.status(200).send(req.user);
}