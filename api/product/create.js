import { backendpracDB } from '../../backendprac-db.js';

export async function createProduct(req, res) {
    const { title, description, price, image_path, token} = req.body;
    console.log({title, description, price, image_path, token});
    console.log("req.user:", req.user);
    const product = await backendpracDB.createProduct(
        title, 
        description, 
        price, 
        image_path
    );
    console.log(product);
    if (product.error){
        return res.status(500).send(product.error);
    }
    res.status(200).send(product);
}