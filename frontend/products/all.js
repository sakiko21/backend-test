
fetch('/products', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => {
        const productsList = document.getElementById("product-list");
        data.forEach(product => {
            const listItem = document.createElement("li");
            const productLink = document.createElement("a");
            productLink.href = `/product/${product.id}`;
            productLink.textContent = product.title;

            listItem.appendChild(productLink);//aをliの中に追加する
            productsList.appendChild(listItem);//liをulの中に追加する
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });