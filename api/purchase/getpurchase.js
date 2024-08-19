import { backendpracDB } from '../../backendprac-db.js';

export async function getPurchase(req, res){
    const user_id = req.user.user.id;
    console.log("fetpurchase内user_id:", user_id);
        try{
            const purchase = await backendpracDB.getPurchase(user_id);
            console.log("purchase:", purchase);
            res.status(200).json(purchase);
        } catch(error){
            res.status(500).json({ error: '購入情報の保存に失敗しました' });
        }
}
