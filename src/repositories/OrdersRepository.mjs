import { getCookie } from "@/functions.mjs";
class OrdersRepository{
  async getOrdersAPI(){
    var url = 'http://localhost:3000/orders'
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

  async searchOrdersAPI(searchKeyWord){
    var url = `http://localhost:3000/orders?q=${searchKeyWord}`
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

  async postOrderAPI (user_id, total_articulos, subtotal, descuento, descuentoTotal, subtotalConDescuento, impuesto, impuestos, totalFinal){
    var url = 'http://localhost:3000/orders'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
        },
        body: JSON.stringify({
          user_id,
          total_articulos,
          subtotal,
          descuento,
          descuentoTotal,
          subtotalConDescuento,
          impuesto,
          impuestos,
          totalFinal
        })
    });
    if (response.ok) console.log("Se ha añadido el pedido correctamente")
    return await response.json();
  }
}

export const ordersRepository = new OrdersRepository();