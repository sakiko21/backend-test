import { backendpracDB } from '../../backendprac-db.js';

export async function createProduct(req, res) {
    const { title, description, price} = req.body;
    console.log({title, description, price});
    console.log("req.user:", req.user);
    //画像を保存すると、req.fileに画像が保持される。ので、productにimage_pathを格納するためにimagepathを定義
    //const image_path = req.file.path;
    let image_path;
    if (process.env.NODE_ENV === "production") {
        image_path = req.file.location;
    }else{
        image_path = req.file ? `/assets/images/${req.file.filename}` : null;
    }
    //console.log("file:", req.file);
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