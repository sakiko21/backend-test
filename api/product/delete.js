import { backendpracDB } from '../../backendprac-db.js';

export async function deleteProduct(req, res){
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
}