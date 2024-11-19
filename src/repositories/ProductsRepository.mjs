import { getCookie } from "@/functions.mjs";
class ProductsRepository{
  async getProductsAPI(){
    // var url = 'http://localhost:3000/products'
    // const response = await fetch(url);
    // return await response.json();
    var url = 'http://localhost:3000/products'
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
    var url = `http://localhost:3000/products?q=${searchKeyWord}`
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
    var url = `http://localhost:3000/products?cat=${searchCategoryId}`
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
    var url = 'http://localhost:3000/products'
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
  
  async putProductAPI(modifiedProduct){
    var url = `http://localhost:3000/products/${modifiedProduct.id}`
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
    var url = `http://localhost:3000/products/${productId}`
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