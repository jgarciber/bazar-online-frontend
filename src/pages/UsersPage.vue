<script setup>
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
import {ref, onMounted, nextTick, computed, watch} from 'vue';
import { getCookie, smoothScrollJS } from '@/functions.mjs';
import { usersRepository } from '@/repositories/UsersRepository.mjs';

const users = ref([]);
const isEditingUser = ref(false);
const isAdmin = ref();
const userId = ref();
// let newUsername = ref();
// let newUserPassword = ref();
// let searchKeyWord = ref();
let newUsernameAdminForm = ref('');
let resetPasswordAdminForm = ref(false); // Checkbox para restablecer la contraseña
let resetFirstNameAdminForm = ref(false);
let resetLastNameAdminForm = ref(false);
let resetEmailAdminForm = ref(false);
let newFirstNameAdminForm = ref('')
let newLastNameAdminForm = ref('')
let newEmailAdminForm = ref('')
let newUserPasswordAdminForm = ref('');
let newUserPassword2AdminForm = ref('');
let newAdminUser = ref(false);
let newActiveUser = ref(false);
let searchKeyWord = ref('');

let newUsernameClientForm = ref();
let newFirstNameClientForm = ref('');
let newLastNameClientForm = ref('');
let newEmailClientForm = ref('');
let resetPasswordClientForm = ref(false)
let newUserPasswordClientForm = ref('');
let newUserPassword2ClientForm = ref('');

function getUsers(){
  usersRepository.getUsersAPI()
  .then(res => {
    users.value = res;
  })
}

function postUser(newUser){
  usersRepository.postUserAPI(newUser)
  .then(res => {
    if(res.message != '') alert(res.message);
    getUsers();
    isEditingUser.value = false;
  })
}

function putUser(newUser){
  usersRepository.putUserAPI(newUser)
  .then(res => {
    if(res.message != '') alert(res.message);
    getUsers();
    isEditingUser.value = false;
  })
} 

function deleteUser(id){
  usersRepository.deleteUserAPI(id)
  .then(res => {
    if(res.message != '') alert(res.message);
    getUsers();
  })
}

function handleSubmit(e){
  e.preventDefault();
  const newUser = Object.fromEntries(new FormData(e.target).entries());
  // Hay que añadir manualmente el valor del campo select del formulario al objeto newUser, ya que este no se incluye en el FormData por no ser de tipo input
  console.log(newUser)
  let newAdminUser = document.getElementById("newAdminUser").checked
  newUser.isAdmin = newAdminUser;
  isEditingUser.value ? putUser(newUser) : postUser(newUser);
  e.target.reset();
}

function handleSubmitAdminForm(e){
  e.preventDefault();
  const newUser = Object.fromEntries(new FormData(e.target).entries());
  // let newAdminUser = document.getElementById("newAdminUser").checked
  newUser.isAdmin = newAdminUser.value;
  newUser.isActive = newActiveUser.value;
  if (!passwordsMatchAdminForm.value && resetPasswordAdminForm.value) {
    return alert("Las contraseñas no coinciden.");
  }else{
    isEditingUser.value ? putUser(newUser) : postUser(newUser);
  }
  // e.target.reset();
  cancelarFormularioUsuario();
}

function handleSubmitClientForm(e){
  e.preventDefault();
  const newUser = Object.fromEntries(new FormData(e.target).entries());
  newUser.isAdmin = false
  newUser.isActive = true
  if (!newUsernameClientForm.value || !newFirstNameClientForm.value || !newLastNameClientForm.value || !newEmailClientForm.value) {
    return alert("Por favor, complete todos los campos.");
  }else if (!passwordsMatchClientForm.value) {
    alert("Las contraseñas no coinciden.");
  }else{
    putUser(newUser);
  }
  // e.target.reset();
  cancelarFormularioUsuario();
}

// function handleModify(user){
//   formUsuario.reset();
//   isEditingUser.value = true;
//   newUsername.value = user.username;
//   document.getElementById("idUser").value = user.id;
//   newAdminUser.checked = user.isAdmin ? true : false;
//   mostrarBtnCancelar();
//   smoothScrollJS('formUsuario')
// }
function handleModify(user){
  if(isAdmin.value){
    //limpio el formulario para que no haya errores
    cancelarFormularioUsuario();
    isEditingUser.value = true;
    document.getElementById("idUserAdminForm").value = user.id;
    resetPasswordAdminForm.value = false;
    newUsernameAdminForm.value = user.username;
    newFirstNameAdminForm = user.firstName;
    newLastNameAdminForm = user.lastName;
    newEmailAdminForm = user.email;
    newUserPasswordAdminForm.value = '';
    newUserPassword2AdminForm.value = '';
    newAdminUser.checked = user.isAdmin ? true : false;
    newActiveUser.value = user.isActive ? true : false;
    smoothScrollJS('userAdminForm')
  }else{
    isEditingUser.value = true;
    document.getElementById("idUserClientForm").value = user.id;
    newUsernameClientForm.value = user.username;
    newUserPasswordClientForm.value = '';
    smoothScrollJS('userClientForm')
  }
}

// function mostrarBtnCancelar(){ 
//   if (newUsername.value == '' && newUserPassword.value == '' && !newAdminUser.checked){
//     btnCancelarFormUsuario.style.display = "inline-none";
//   }else{
//     btnCancelarFormUsuario.style.display = "inline-block";
//   }
// }

function handleDelete(user){
  if (confirm(`¿Está seguro que quiere borrar el usuario "${user.username}"?`)) deleteUser(user.id);
}

// function cancelarFormularioUsuario(){
//   formUsuario.reset();
//   isEditingUser.value = false;
//   // mostrarBtnCancelar();
// }
function cancelarFormularioUsuario(){
  if(isAdmin.value){
    // Para resetear los valores de los campos del formulario hay que establecerlos a vacío manualmente ya que si no Vue los vuelve a recuperar de los valores que tiene almacenados en las variables reactivas ref. Por eso el método reset() no funciona correctamente.
    // userAdminForm.reset();
    newUsernameAdminForm.value = '';
    newFirstNameAdminForm = '';
    newLastNameAdminForm = '';
    newEmailAdminForm = '';
    newUserPasswordAdminForm.value = '';
    newUserPassword2AdminForm.value = '';
    resetFirstNameAdminForm.value = false;
    resetLastNameAdminForm.value = false;
    resetEmailAdminForm.value = false;
    resetPasswordAdminForm.value = false;
    newAdminUser.value = false;
    newActiveUser.value = false;
    isEditingUser.value = false;
  }else{
    // userClientForm.reset();
    newUsernameClientForm.value = '';
    newFirstNameClientForm.value = '';
    newLastNameClientForm.value = '';
    newEmailClientForm.value = '';
    resetPasswordClientForm.value = false;
    newUserPasswordClientForm.value = '';
    newUserPassword2ClientForm.value = '';
  }
}

function testNewUserAdminForm(){
  if (!isEditingUser.value){
    resetFirstNameAdminForm.value = true;
    resetLastNameAdminForm.value = true;
    resetEmailAdminForm.value = true;
    resetPasswordAdminForm.value = true;
    newActiveUser.value = true;
  }
}


function handleSearchUser(e){
  e.preventDefault();
  usersRepository.searchUsersAPI(searchKeyWord.value)
    .then(res => {
      users.value = res;
    })
}

watch(searchKeyWord, (newValue) => {
  if (newValue.trim() === '') {
    getUsers();
  }
});

// Propiedad computada para verificar si las contraseñas coinciden
const passwordsMatchAdminForm = computed(() => {
  return newUserPasswordAdminForm.value === newUserPassword2AdminForm.value;
});

const passwordsMatchClientForm = computed(() => {
  return newUserPasswordClientForm.value === newUserPassword2ClientForm.value;
});

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getUsers();
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    userId.value = sessionStorage.getItem('user_id');
    //la función nextTick se ejecuta una vez que se ha renderizado el DOM, pudiendo así capturar sus diferentes elementos que de otro modo no existirían, ya que para mostrarlos he utilizado v-if que los mostraban en función de una variable.
    nextTick(() => {
      if (isAdmin.value){
        // let btnCancelarFormUsuario = document.getElementById("btnCancelarFormUsuario");
        // let formUsuario = document.getElementById("formUsuario");
        // let newAdminUser = document.getElementById("newAdminUser");
        // btnCancelarFormUsuario.style.display = "none";
        let btnCancelarAdminForm = document.getElementById("btnCancelarAdminForm");
        let userAdminForm = document.getElementById("userAdminForm");
      }else{
        let btnCancelarClientForm = document.getElementById("btnCancelarClientForm");
        let userClientForm = document.getElementById("userClientForm");
      }
    });
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto w-5/6 overflow-auto">
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
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Es admin</th>
                <th v-if="isAdmin">Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td>{{user.username}}</td>
                <td>{{user.firstName}}</td>
                <td>{{user.lastName}}</td>
                <td>{{user.email}}</td>
                <td>{{user.isAdmin}}</td>
                <td v-if="isAdmin">{{user.isActive}}</td>
                <td>
                  <GenericBlueButton class="m-0.5" @click="handleModify(user)">Modificar</GenericBlueButton>
                  <GenericRedButton v-if="isAdmin && user.id != userId" class="m-0.5" @click="handleDelete(user)">Borrar</GenericRedButton>
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
      <form v-if="isAdmin == true" @submit="handleSubmitAdminForm" @change="testNewUserAdminForm" id="userAdminForm" class="mx-auto w-full py-6 anadir-usuario">
      <!-- <form @submit="handleSubmit" id="formProducto"> -->
        <fieldset class="flex flex-col items-center border-2 border-solid border-black p-6 rounded-lg bg-orange-400 gap-1">
          <legend class="text-left text-lg font-semibold">{{ (!isEditingUser) ? 'Registrar Usuario' : 'Modificar Usuario' }}</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idUserAdminForm" hidden>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUsernameAdminForm" class="text-left border border-solid border-black">Usuario</label>
            <input v-model="newUsernameAdminForm" type="text" name="username" id="newUsernameAdminForm" @input="isEditingUser = false;" required :readonly="isEditingUser">
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="resetFirstNameAdminForm">{{ (isEditingUser == false) ? 'Establecer Nombre' : 'Restablecer Nombre' }}</label>
            <span style="width: 200px;">
              <input v-model="resetFirstNameAdminForm" id="resetFirstNameAdminForm" type="checkbox" name="resetFirstNameAdminForm" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" :required="!isEditingUser">
            </span>
          </div>
          <div v-if="resetFirstNameAdminForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newFirstNameAdminForm" class="text-left border border-solid border-black">Nombre</label>
            <input v-model="newFirstNameAdminForm" type="text" name="firstName" id="newFirstNameAdminForm" pattern="^[a-zA-Zª]+(?: [a-zA-Zª]+)*$" title="El nombre puede estar formado por varias palabras, sin números o caracteres especiales, salvo el carácter ª" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="resetLastNameAdminForm">{{ (isEditingUser == false) ? 'Establecer Apellidos' : 'Restablecer Apellidos' }}</label>
            <span style="width: 200px;">
              <input v-model="resetLastNameAdminForm" id="resetLastNameAdminForm" type="checkbox" name="resetLastNameAdminForm" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" :required="!isEditingUser">
            </span>
          </div>
          <div v-if="resetLastNameAdminForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newLastNameAdminForm" class="text-left border border-solid border-black">Apellidos</label>
            <input v-model="newLastNameAdminForm" type="text" name="lastName" id="newLastNameAdminForm" pattern="^[a-zA-Zª]+(?: [a-zA-Zª]+)*$" title="El nombre puede estar formado por varias palabras, sin números o caracteres especiales, salvo el carácter ª" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="resetEmailAdminForm">{{ (isEditingUser == false) ? 'Establecer Correo' : 'Restablecer Correo' }}</label>
            <span style="width: 200px;">
              <input v-model="resetEmailAdminForm" id="resetEmailAdminForm" type="checkbox" name="resetEmailAdminForm" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" :required="!isEditingUser">
            </span>
          </div>
          <div v-if="resetEmailAdminForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newEmailAdminForm" class="text-left border border-solid border-black">Correo</label>
            <input v-model="newEmailAdminForm" type="email" name="email" id="newEmailAdminForm" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
              <!-- <input v-model="newAdminUser" type="checkbox" name="isAdmin" id="newAdminUser" required> -->
            <label for="resetPasswordAdminForm">{{ (isEditingUser == false) ? 'Establecer Contraseña' : 'Restablecer Contraseña' }}</label>
            <span style="width: 200px;">
              <input v-model="resetPasswordAdminForm" id="resetPasswordAdminForm" type="checkbox" name="resetPasswordAdminForm" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" :required="!isEditingUser">
            </span>
          </div>
          <div v-if="resetPasswordAdminForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPasswordAdminForm" class="text-left">Nueva contraseña</label>
            <input v-model="newUserPasswordAdminForm" type="password" name="password1" id="newUserPasswordAdminForm" :class="{'!border-green-500': passwordsMatchAdminForm, '!border-red-500': !passwordsMatchAdminForm, '!border-2':true}" pattern="^.{8,}$" 
            title="La contraseña debe tener al menos 8 caracteres" :required="resetPasswordAdminForm">
          </div>
          <div v-if="resetPasswordAdminForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPassword2AdminForm" class="text-left">Repetir Contraseña</label>
            <input v-model="newUserPassword2AdminForm" type="password" name="password2" id="newUserPassword2AdminForm" :class="{'!border-green-500': passwordsMatchAdminForm, '!border-red-500': !passwordsMatchAdminForm, '!border-2':true}" pattern="^.{8,}$" 
            title="La contraseña debe tener al menos 8 caracteres" :required="resetPasswordAdminForm">
          </div>
          <!-- <div class="flex flex-col items-center justify-start flex-wrap w-full"> -->
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
              <!-- <input v-model="newAdminUser" type="checkbox" name="isAdmin" id="newAdminUser" required> -->
            <label for="newAdminUser">Es usuario administrador</label>
            <span style="width: 200px;">
              <input v-model="newAdminUser" id="newAdminUser" type="checkbox" name="isAdmin" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </span>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newActiveUser">Está activo</label>
            <span style="width: 200px;">
              <input v-model="newActiveUser" id="newActiveUser" type="checkbox" name="isActive" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </span>
          </div>
          <br>
          <div class="flex flex-wrap justify-center gap-1">
            <input type="submit" :value="(!isEditingUser) ? 'Registrar Usuario' : 'Modificar Usuario'" id="btnSubmitAdminForm" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
            <GenericRedButton v-if="newUsernameAdminForm != '' || resetFirstNameAdminForm != false || newFirstNameAdminForm != '' || resetLastNameAdminForm != false || newLastNameAdminForm != '' || resetEmailAdminForm != false || newEmailAdminForm != '' || resetPasswordAdminForm != false || newUserPasswordAdminForm != '' || newAdminUser != false || newActiveUser != false" type="button" @click="cancelarFormularioUsuario" id="btnCancelarAdminForm">Cancelar</GenericRedButton>

          </div>
        </fieldset>
      </form>
      
      <form v-else @submit="handleSubmitClientForm" id="userClientForm" class="mx-auto w-full py-6 anadir-usuario">
      <!-- <form @submit="handleSubmit" id="formProducto"> -->
        <fieldset class="flex flex-col items-center border-2 border-solid border-black p-6 rounded-lg bg-orange-400 gap-1">
          <legend class="text-left text-lg font-semibold">Modificar usuario</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idUserClientForm" hidden>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUsernameClientForm" class="text-left border border-solid border-black">Usuario</label>
            <input v-model="newUsernameClientForm" type="text" name="username" id="newUsernameClientForm" placeholder="Seleccione 'modificar'" title="Seleccione \'modificar\' un usuario para rellenar el formulario" required readonly>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newFirstNameClientForm" class="text-left border border-solid border-black">Nombre</label>
            <input v-model="newFirstNameClientForm" type="text" name="firstName" id="newFirstNameClientForm" placeholder="Seleccione 'modificar'" pattern="^[a-zA-Zª]+(?: [a-zA-Zª]+)*$" title="El nombre puede estar formado por varias palabras, sin números o caracteres especiales, salvo el carácter ª" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newLastNameClientForm" class="text-left border border-solid border-black">Apellidos</label>
            <input v-model="newLastNameClientForm" type="text" name="lastName" id="newLastNameClientForm" placeholder="Seleccione 'modificar'" pattern="^[a-zA-Zª]+(?: [a-zA-Zª]+)*$" title="El nombre puede estar formado por varias palabras, sin números o caracteres especiales, salvo el carácter ª" required>
          </div>
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newEmailClientForm" class="text-left border border-solid border-black">Correo</label>
            <input v-model="newEmailClientForm" type="email" name="email" id="newEmailClientForm" placeholder="Seleccione 'modificar'" title="Seleccione \'modificar\' un usuario para rellenar el formulario" required>
          </div>
          <!-- <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPasswordClientForm" class="text-left">Nueva Contraseña</label>
            <input v-model="newUserPasswordClientForm" type="password" name="password" id="newUserPasswordClientForm" required>
          </div> -->
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
              <!-- <input v-model="newAdminUser" type="checkbox" name="isAdmin" id="newAdminUser" required> -->
            <label for="resetPasswordClientForm">Restablecer Contraseña</label>
            <span style="width: 200px;">
              <input v-model="resetPasswordClientForm" id="resetPasswordClientForm" type="checkbox" name="resetPasswordClientForm" class="!w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            </span>
          </div>
          <div v-if="resetPasswordClientForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPasswordClientForm" class="text-left">Nueva contraseña</label>
            <input v-model="newUserPasswordClientForm" type="password" name="password1" id="newUserPasswordClientForm" :class="{'!border-green-500': passwordsMatchClientForm, '!border-red-500': !passwordsMatchClientForm, '!border-2':true}" pattern="^.{8,}$" 
            title="La contraseña debe tener al menos 8 caracteres" required>
          </div>
          <div v-if="resetPasswordClientForm" class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-1">
            <label for="newUserPassword2ClientForm" class="text-left">Repetir Contraseña</label>
            <input v-model="newUserPassword2ClientForm" type="password" name="password2" id="newUserPassword2ClientForm" :class="{'!border-green-500': passwordsMatchClientForm, '!border-red-500': !passwordsMatchClientForm, '!border-2':true}" pattern="^.{8,}$" 
            title="La contraseña debe tener al menos 8 caracteres" required>
          </div>
          <br>
          <div class="flex flex-wrap justify-center gap-1">
            <input type="submit" id="btnSubmitClientForm" value="Modificar usuario" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
            <GenericRedButton v-if="newUsernameClientForm != '' || newUserPasswordClientForm != ''" type="button" @click="cancelarFormularioUsuario" id="btnCancelarClientForm">Cancelar</GenericRedButton>
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

input .border-green-500, input .border-red-500{
  border-width: 6px !important;
  transition: border-color 0.3s;
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
