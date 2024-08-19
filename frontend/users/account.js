document.addEventListener('DOMContentLoaded', async function() {
    try{
    // /user/account エンドポイントを叩いてユーザー情報を取得
    const userResponse = await fetch('/user/account');
    if (userResponse.redirected) {
        // トップページにリダイレクトされた場合
        window.location.href = response.url;
    } else if (!userResponse.ok) {
        throw new Error('エラー');
    }
    const user = await userResponse.json();
    
    const user_id = user.user.id; // userオブジェクトの中にuserフィールドがあるため
    const purchaseResponse = await fetch(`/purchase/get`);
    const purchases = await purchaseResponse.json();

    const historyContainer = document.getElementById("history");

    //購入履歴がある時
    if (purchases.length > 0){
        purchases.forEach(purchase => {
            const purchaseElement = document.createElement('div');
            purchaseElement.textContent = `購入ID: ${purchase.id}, 合計金額: ${purchase.amount}円, 商品ID: ${purchase.product_ids.join(', ')}`;
            historyContainer.appendChild(purchaseElement);
        });
    } else {
        historyContainer.textContent = '購入履歴はありません。';
    }
} catch(error) {
    console.error('ユーザー情報の取得に失敗:', error);
    alert('ユーザー情報の取得に失敗しました');
    window.location.href = '/'; // トップページへリダイレクト
} 
});