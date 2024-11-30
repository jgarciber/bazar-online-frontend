import { getCookie } from "@/functions.mjs";
class UsersRepository{
  async getUsersAPI(){
    var url = import.meta.env.VITE_HOST + '/users'
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
    var url = import.meta.env.VITE_HOST + `/users?q=${searchKeyWord}`
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
    var url = import.meta.env.VITE_HOST + '/users'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password1,
        isAdmin: newUser.isAdmin,
        isActive: newUser.isActive
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }
  
  async putUserAPI(newUser){
    var url = import.meta.env.VITE_HOST + `/users/${newUser.id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : `${sessionStorage.getItem('user')} ${getCookie('token')}`
      },
      body: JSON.stringify({
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password1,
        isAdmin: newUser.isAdmin,
        isActive: newUser.isActive
      })
    });
    if(response.status == 403) alert('Acción no permitida')
    return await response.json();
  }
  
  async deleteUserAPI(userId){
    var url = import.meta.env.VITE_HOST + `/users/${userId}`
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

export const usersRepository = new UsersRepository