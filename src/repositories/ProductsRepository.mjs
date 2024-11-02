class ProductsRepository{
  async getProductsAPI(){
    var url = 'http://localhost:3000/products'
    const response = await fetch(url);
    return await response.json();
  }

  async searchProductsAPI(searchKeyWord){
    var url = `http://localhost:3000/products?q=${searchKeyWord}`
    const response = await fetch(url);
    return await response.json();
  }

  async searchProductsByCategoryAPI(searchCategoryId){
    var url = `http://localhost:3000/products?cat=${searchCategoryId}`
    const response = await fetch(url);
    return await response.json();
  }
  
  async postProductAPI(newProduct){
    var url = 'http://localhost:3000/products'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({a: 1, b: 'Textual content'})
      body: JSON.stringify({
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        category: newProduct.category
      })
    });
    return await response.json();
  }
  
  async putProductAPI(modifiedProduct){
    var url = `http://localhost:3000/products/${modifiedProduct.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: modifiedProduct.id,
        name: modifiedProduct.name,
        price: modifiedProduct.price,
        stock: modifiedProduct.stock,
        category: modifiedProduct.category
      })
    });
  }
  
  async deleteProductAPI(productId){
    var url = `http://localhost:3000/products/${productId}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export const productsRepository = new ProductsRepository