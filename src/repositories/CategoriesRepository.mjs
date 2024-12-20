import { getCookie } from "@/functions.mjs";
class CategoriesRepository{
  async getCategoriesAPI(){
    var url = import.meta.env.VITE_HOST + '/categories'
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
  
  async postCategoryAPI(newCategory){
    var url = import.meta.env.VITE_HOST + '/categories'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        name: newCategory.name,
        description: newCategory.description,
      })
    });

    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }
  
  async putCategoryAPI(modifiedCategory){
    var url = import.meta.env.VITE_HOST + `/categories/${modifiedCategory.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        id: modifiedCategory.id,
        name: modifiedCategory.name,
        description: modifiedCategory.description,
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }
  
  async deleteCategoryAPI(categoryId){
    var url = import.meta.env.VITE_HOST + `/categories/${categoryId}`
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

export const categoriesRepository = new CategoriesRepository;