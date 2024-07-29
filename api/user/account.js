export async function account(req, res){
    try{
    const user = req.user;
    delete user.iat;
    delete user.exp;
    res.status(200).send(req.user);
    } catch{
        res.status(500).redirect('/');
    }
}