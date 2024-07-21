import { backendpracDB } from '../../backendprac-db.js';

export async function product(req, res){
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
}