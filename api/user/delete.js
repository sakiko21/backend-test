import { backendpracDB } from '../../backendprac-db.js';

export async function deleteUser(req, res){
    const { id } = req.body;
    console.log({id});
    const user = await backendpracDB.deleteUser(id);
    console.log(user);
    if (user.error){
        return res.status(500).send(user.error);
    }
    res.status(200).send(user);
};