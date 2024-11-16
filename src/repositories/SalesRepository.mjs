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

  async searchSalesAPI(searchKeyWord, searchBy, startDate, endDate){
    var url = `http://localhost:3000/sales?q=${searchKeyWord}&type=${searchBy}&startDate=${startDate}&endDate=${endDate}`
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

  async postSaleAPI (user_id, newProduct, quantity){
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
        quantity: quantity,
        user_id
        })
    });
    if (response.ok) console.log("Se ha añadido una venta correctamente")
    return await response.json();
  }
}

export const salesRepository = new SalesRepository();