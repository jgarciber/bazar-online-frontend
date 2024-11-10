<script setup>
import GenericGreenButton from '@/components/GenericGreenButton.vue';
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
import {ref, onMounted, nextTick} from 'vue';
import { getCookie, smoothScrollJS } from '@/functions.mjs';
import { usersRepository } from '@/repositories/UsersRepository.mjs';

const users = ref([]);
const isEditingUser = ref(false);
const isAdmin = ref();
let newUsername = ref();
let newUserPassword = ref();
let searchKeyWord = ref();

function getUsers(){
  usersRepository.getUsersAPI()
  .then(res => {
    users.value = res;
  })
}

function postUser(newUser){
  usersRepository.postUserAPI(newUser)
  .then(res => {
    if(res != undefined) alert(res);
    getUsers();
    isEditingUser.value = false;
  })
}

function putUser(newUser){
  usersRepository.putUserAPI(newUser)
  .then(res => {
    getUsers();
    isEditingUser.value = false;
  })
} 

function deleteUser(id){
  usersRepository.deleteUserAPI(id)
  .then(res => {
    console.log(res)
    if(res != '') alert(res);
    getUsers();
  })
}

function handleSubmit(e){
  e.preventDefault();
  const newUser = Object.fromEntries(new FormData(e.target).entries());
  // Hay que añadir manualmente el valor del campo select del formulario al objeto newUser, ya que este no se incluye en el FormData por no ser de tipo input
  // console.log(newAdminUser.checked)
  let newAdminUser = document.getElementById("newAdminUser").checked
  newUser.isAdmin = newAdminUser;
  isEditingUser.value ? putUser(newUser) : postUser(newUser);
  e.target.reset();
  // mostrarBtnCancelar();
}

function handleModify(user){
  formUsuario.reset();
  isEditingUser.value = true;
  newUsername.value = user.username;
  document.getElementById("idUser").value = user.id;
  newAdminUser.checked = user.isAdmin ? true : false;
  mostrarBtnCancelar();
  smoothScrollJS('formUsuario')
}

function mostrarBtnCancelar(){ 
  if (newUsername.value == '' && newUserPassword.value == '' && !newAdminUser.checked){
    btnCancelarFormUsuario.style.display = "inline-none";
  }else{
    btnCancelarFormUsuario.style.display = "inline-block";
  }
}

function handleDelete(user){
  if (confirm(`¿Está seguro que quiere borrar el usuario "${user.username}"?`)) deleteUser(user.id);
}

function cancelarFormularioUsuario(){
  formUsuario.reset();
  isEditingUser.value = false;
  // mostrarBtnCancelar();
}


function handleSearchUser(e){
  e.preventDefault();
  usersRepository.searchUsersAPI(searchKeyWord.value)
    .then(res => {
      users.value = res;
    })
}

function testEmptySearch(){
  if(searchKeyWord.value == '') getUsers();
}

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getUsers();
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    //la función nextTick se ejecuta una vez que se ha renderizado el DOM, pudiendo así capturar sus diferentes elementos que de otro modo no existirían, ya que para mostrarlos he utilizado v-if que los mostraban en función de una variable.
    nextTick(() => {
      if (isAdmin.value){
        let btnCancelarFormUsuario = document.getElementById("btnCancelarFormUsuario");
        let formUsuario = document.getElementById("formUsuario");
        let newAdminUser = document.getElementById("newAdminUser");
        btnCancelarFormUsuario.style.display = "none";
      }else{
        isEditingUser.value = true;
      }
    });
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto overflow-auto">
    <div class="my-6">

      <form v-if="isAdmin" class="max-w-md mx-auto mb-6" @submit="handleSearchUser" @keydown="testEmptySearch">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" v-model="searchKeyWord" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Usuarios..." required />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>

      <div class="flex flex-row flex-wrap justify-center my-6">
      
        <div v-if="users.length != 0" class="relative overflow-x-auto sm:rounded-md">
          <table class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
            <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Nombre</th>
                <th>Es admin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td>{{user.username}}</td>
                <td>{{user.isAdmin}}</td>
                <td>
                  <GenericBlueButton @click="handleModify(user)">Modificar</GenericBlueButton>
                  <GenericRedButton v-if="isAdmin" @click="handleDelete(user)">Borrar</GenericRedButton>
                </td>
              </tr> 
            </tbody>
          </table>
        </div>
        <h3 v-else class="mx-auto my-auto">No hay ningún resultado</h3>
      </div>

    </div>
    <hr>
    <div class="my-6">
      <form @submit="handleSubmit" id="formUsuario" @input="mostrarBtnCancelar" class="mx-auto w-full py-6 anadir-usuario">
      <!-- <form @submit="handleSubmit" id="formProducto"> -->
        <fieldset class="flex flex-col items-center border-2 border-solid border-black p-6 rounded-lg bg-orange-400 gap-1">
          <legend v-if="isEditingUser == false && isAdmin==true" class="text-left text-lg font-semibold">Registrar Usuario</legend>
          <legend v-else class="text-left text-lg font-semibold">Modificar usuario</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idUser" hidden>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUsername" class="text-left border border-solid border-black">Nombre</label>
            <input v-model="newUsername" type="text" name="username" id="newUsername" placeholder="Seleccione 'modificar'" oninvalid="this.setCustomValidity('Seleccione \'modificar\' un usuario para rellenar el formulario')" onkeypress="return false;" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPassword" class="text-left">Contraseña</label>
            <input v-model="newUserPassword" type="password" name="password" id="newUserPassword" required>
          </div>
          <div class="flex items-center justify-start flex-wrap w-full">
            <!-- <input v-model="newAdminUser" type="checkbox" name="isAdmin" id="newAdminUser" required> -->
            <label for="newAdminUser" class="text-left">Es usuario administrador</label>
            <input id="newAdminUser" type="checkbox" name="isAdmin" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          </div>
          <br>
          <div class="flex flex-wrap justify-center gap-1">
            <input v-if="isEditingUser == false && isAdmin==true" type="submit" value="Registrar usuario" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
            <input v-else type="submit" value="Modificar usuario" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
            <GenericRedButton type="button" @click="cancelarFormularioUsuario" id="btnCancelarFormUsuario">Cancelar</GenericRedButton>
          </div>
        </fieldset>
      </form>
    </div>
  </section>
</template>

<style scoped>
thead{
  border: solid;
  background-color: lightgreen
}
table tr:hover{
  background-color: lightblue;
}
label{
  width: 100px;
  display: inline-block;
}
nav ul{
  list-style-type: none;
  text-decoration: none;
}
nav li{
  display: inline-block;
  padding-left: 30px;
}

form.anadir-usuario label, form.anadir-usuario input{
  border: solid;
  border-width: 1px;
  width: 200px;
  padding: 0;
}
table td{
  padding: 5px;
}
table, table td, table th{
  border: solid;
}
section{
  /* display: flex; */
  /* flex-direction: row; */
}
 header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
