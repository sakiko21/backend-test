import { backendpracDB } from '../../backendprac-db.js';

export async function getAllProducts(req, res){
    const products = await backendpracDB.getProducts();
    console.log(products);
    res.status(200).send(products);
}