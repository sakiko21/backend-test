import { backendpracDB } from '../../backendprac-db.js';

export async function updateProduct(req, res){
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
}