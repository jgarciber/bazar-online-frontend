import { getCookie } from "@/functions.mjs";
class UsersRepository{
  async getUsersAPI(){
    var url = 'http://localhost:3000/users'
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

  async searchUsersAPI(searchKeyWord){
    var url = `http://localhost:3000/users?q=${searchKeyWord}`
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
  
  async postUserAPI(newUser){
    var url = 'http://localhost:3000/users'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        username: newUser.username,
        password: newUser.password,
        isAdmin: newUser.isAdmin
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    if(response.ok) return await response.text();
  }
  
  async putUserAPI(newUser){
    var url = `http://localhost:3000/users/${newUser.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        password: newUser.password,
        isAdmin: newUser.isAdmin
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    if(response.status == 201) alert('Se ha modificado la información del usuario correctamente')
    if(response.status == 404) alert('No se ha podido modificar la información del usuario')
  }
  
  async deleteUserAPI(userId){
    var url = `http://localhost:3000/users/${userId}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      }
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.text();
  }
}

export const usersRepository = new UsersRepository