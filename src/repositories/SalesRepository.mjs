import { getCookie } from "@/functions.mjs";
class SalesRepository{
  async getSalesAPI(){
    var url = import.meta.env.VITE_HOST + '/sales'
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
    var url = import.meta.env.VITE_HOST + `/sales?q=${searchKeyWord}&type=${searchBy}&startDate=${startDate}&endDate=${endDate}`
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

  async postSaleAPI (user_id, newProduct, quantity, orderId){
    var url = import.meta.env.VITE_HOST + '/sales'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
        },
        body: JSON.stringify({
          product:{
            id: String(newProduct.id),
            name: String(newProduct.name),
            price: String(newProduct.price),
            stock: String(newProduct.stock),
            quantity: String(quantity)
          },
          order:{
            user_id: String(user_id),
            order_id: String(orderId)
          }
        })
    });
    if (response.ok) console.log("Se ha añadido una venta correctamente")
    return await response.json();
  }
}

export const salesRepository = new SalesRepository();