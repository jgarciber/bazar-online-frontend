class SalesRepository{
  async getSalesAPI(){
    var url = 'http://localhost:3000/sales'
    const response = await fetch(url);
    return await response.json();
  }

  async postSaleAPI (newProduct, quantity){
    var url = 'http://localhost:3000/sales'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        quantity: quantity
        })
    });
    
    return await response.json();
  }
}

export const salesRepository = new SalesRepository();