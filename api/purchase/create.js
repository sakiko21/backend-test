import { backendpracDB } from '../../backendprac-db.js';

export async function createPurchase(req, res){
    const { user_id, amount, product_ids } = req.body;
        console.log({user_id, amount, product_ids});
        try{
            const purchase = await backendpracDB.createPurchase(user_id, amount, product_ids);
            console.log("purchase:", purchase);
            res.status(200).json(purchase);
        } catch(error){
            console.log("purchase:", purchase);
            res.status(500).json({ error: '購入情報の保存に失敗しました' });
        }
}