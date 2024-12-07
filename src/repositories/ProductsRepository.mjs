import { getCookie } from "@/functions.mjs";
class ProductsRepository{
  async getProductsAPI(){
    // var url = import.meta.env.VITE_HOST + '/products'
    // const response = await fetch(url);
    // return await response.json();
    var url = import.meta.env.VITE_HOST + '/products'
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

  async searchProductsAPI(searchKeyWord){
    var url = import.meta.env.VITE_HOST + `/products?q=${searchKeyWord}`
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

  async searchProductsByCategoryAPI(searchCategoryId){
    var url = import.meta.env.VITE_HOST + `/products?cat=${searchCategoryId}`
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
  
  async postProductAPI(newProduct){
    var url = import.meta.env.VITE_HOST + '/products'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      // body: JSON.stringify({a: 1, b: 'Textual content'})
      body: JSON.stringify({
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        category: newProduct.categoryId
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }

  async checkoutAPI(cart) {
    // Obtener los datos necesarios
    const userId = sessionStorage.getItem('user_id');
    
    // Construir el cuerpo de la solicitud (JSON)
    const bodyJSON = {
      user_id: String(userId),
      cart: cart.map(product => ({
        product_id: String(product.id),
        quantity: String(product.quantity)
      }))
    };
    
    // Definir la URL del backend
    const url = import.meta.env.VITE_HOST + '/products/checkout';
    
    try {
      // Hacer la solicitud fetch
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${sessionStorage.getItem('user')} ${getCookie('token')}`
        },
        body: JSON.stringify(bodyJSON)  // Enviar el objeto como JSON
      });
  
      // Si el código de estado no es exitoso (2xx), lanzamos un error
      if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Error desconocido';
          // alert(errorMessage);

        // Crear un nuevo objeto de error con la información relevante
        const customError = new Error(errorMessage);
        
        // Agregar la información de la respuesta como parte del objeto de error
        customError.response = {
          status: response.status,
          data: errorData
        };

        throw customError;  // Lanzamos el error con la nueva estructura
      }
  
      // Si todo es correcto, retornamos los datos de la respuesta
      return await response.json();
    } catch (error) {
      // Log del error
      console.log('Error al realizar la solicitud:', error);
      // Si hay un error, retornamos null (la otra función puede decidir qué hacer)
      throw error;
      // return { error: error || 'Hubo un error desconocido al procesar la solicitud.' };
    }
  }
  
  async putProductAPI(modifiedProduct){
    var url = import.meta.env.VITE_HOST + `/products/${modifiedProduct.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        id: modifiedProduct.id,
        name: modifiedProduct.name,
        price: modifiedProduct.price,
        stock: modifiedProduct.stock,
        category: modifiedProduct.categoryId
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }
  
  async deleteProductAPI(productId){
    var url = import.meta.env.VITE_HOST + `/products/${productId}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      }
    });
    if(response.status == 403) alert('Acción no permitida')
      return await response.json();
  }
}

export const productsRepository = new ProductsRepository