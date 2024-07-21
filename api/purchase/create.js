import { backendpracDB } from '../../backendprac-db.js';

export async function createPurchase(req, res){
    const { user_id, amount, product_ids } = req.body;
        console.log({user_id, amount, product_ids});
        const purchase = await backendpracDB.createPurchase(user_id, amount, product_ids);
        console.log(purchase);
        if (purchase.error){
            return res.status(500).send(purchase.error);
        }
        res.status(200).send(purchase);
}