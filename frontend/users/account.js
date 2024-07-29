document.addEventListener('DOMContentLoaded', function() {
    // /user/account エンドポイントを叩いてユーザー情報を取得
    fetch('/user/account')
        .then(response => {
            if (response.redirected) {
                // トップページにリダイレクトされた場合
                window.location.href = response.url;
            } else if (!response.ok) {
                throw new Error('Failed to fetch user account');
            }
            return response.json();
        })
        .then(user => {
            // ユーザー情報を使用してページを更新
            console.log('User:', user);
            // 必要に応じてページの内容を更新
        })
        .catch(error => {
            window.location.href = '/'; // トップページへリダイレクト
            console.error('ユーザー情報の取得に失敗:', error);
            alert('ユーザー情報の取得に失敗しました');
            
        });
});
