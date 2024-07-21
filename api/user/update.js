export async function updateUser(req, res){
    const { id, name, email } = req.body;
    console.log({id, name, email});
    const user = await backendpracDB.updateUser(id, name, email);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);
    }
    res.status(200).send(user);

}