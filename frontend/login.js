function login(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password}),
    })
        // .then((res) => res.json())
        // .then((data) => {
        //     if (data.error) {
        //         alert(data.error);
        //     } else {
        //         alert('ログイン成功');
        //     }
        // })
        .then((res) => {
            if (res.redirected) {
                window.location.href = res.url; // リダイレクトされた場合、URLにリダイレクト
                return;
            }
            return res.json().then((data) => {
                if (res.status !== 200) {
                    throw new Error(data.error || 'Unknown error occurred');
                }
                return data;
            });
        })
        .then((data) => {
            alert('ログイン成功');
            window.location.href = '/users/account'; // 手動でリダイレクト
        })




        .catch((error) => {
            alert(error);
        }
        );
}
