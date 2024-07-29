document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        console.log('Response status:', res.status);
        return res.text().then((text) => {
            console.log('Response text:', text);
            if (res.ok) {
                alert('ログアウトしました');
                window.location.href = '/'; // トップページへリダイレクト
            } else {
                alert('ログアウトに失敗しました');
            }
        });
    })
    .catch((error) => {
        console.error('Logout error:', error);
        alert('ログアウト中にエラーが発生しました');
    });
});
