import { getCookie } from "@/functions.mjs";
class OrdersRepository{
  async getOrdersAPI(){
    var url = import.meta.env.VITE_HOST + '/orders'
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

  async getOrderBillPDFAPI(){
    var url = import.meta.env.VITE_HOST + '/orders/factura-pdf'
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      }
    });

    // Procesamos la respuesta como un blob (binario)
    const pdfBlob = await response.blob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);  // Abrir el PDF en una nueva ventana o pestaña
  }

  async searchOrdersAPI(searchKeyWord){
    var url = import.meta.env.VITE_HOST + `/orders?q=${searchKeyWord}`
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
    var url = import.meta.env.VITE_HOST + '/orders'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
        },
        body: JSON.stringify({
          user_id: String(user_id),
          total_articulos: String(total_articulos),
          subtotal: String(subtotal),
          descuento: String(descuento),
          descuentoTotal: String(descuentoTotal),
          subtotalConDescuento: String(subtotalConDescuento),
          impuesto: String(impuesto),
          impuestos: String(impuestos),
          totalFinal: String(totalFinal)
        })
    });
    if (response.ok) console.log("Se ha añadido el pedido correctamente")
    return await response.json();
  }
}

export const ordersRepository = new OrdersRepository();