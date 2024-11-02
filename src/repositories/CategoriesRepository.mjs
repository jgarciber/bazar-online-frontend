class CategoriesRepository{
  async getCategoriesAPI(){
    var url = 'http://localhost:3000/categories'
    const response = await fetch(url);
    return await response.json();
  }
  
  async postCategoryAPI(newCategory){
    var url = 'http://localhost:3000/categories'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({a: 1, b: 'Textual content'})
      body: JSON.stringify({
        name: newCategory.name,
        description: newCategory.description,
      })
    });

    return await response.json();
  }
  
  async putCategoryAPI(modifiedCategory){
    var url = `http://localhost:3000/categories/${modifiedCategory.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: modifiedCategory.id,
        name: modifiedCategory.name,
        description: modifiedCategory.description,
      })
    });
  }
  
  async deleteCategoryAPI(categoryId){
    var url = `http://localhost:3000/categories/${categoryId}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export const categoriesRepository = new CategoriesRepository;