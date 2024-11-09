import { getCookie } from "@/functions.mjs";
class SalesRepository{
  async getSalesAPI(){
    var url = 'http://localhost:3000/sales'
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      }
    });
    return await response.json();
  }

  async postSaleAPI (newProduct, quantity){
    var url = 'http://localhost:3000/sales'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
        },
        body: JSON.stringify({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        quantity: quantity
        })
    });
    if (response.ok) alert("Se ha realizado la compra correctamente")
    return await response.json();
  }
}

export const salesRepository = new SalesRepository();