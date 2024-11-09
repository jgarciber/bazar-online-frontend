<script setup>
import { loginRepository } from '@/repositories/LoginRepository';
import {ref} from 'vue';

const username = ref();
const password = ref();
const password2 = ref();

function postUserLogin(userTryingToRegister){
    loginRepository.postUserLoginAPI(userTryingToRegister).then(res => {
        // alert(`Se ha registrado al usuario ${userTryingToRegister.username} correctamente`)
        alert(res);
        window.location.href = '/login';
    })
}

function handleSubmit(e){
  e.preventDefault();
  const userTryingToLog = Object.fromEntries(new FormData(e.target).entries());
  postUserLogin(userTryingToLog);
}

function handleTestPass(e){
  // console.log(password)
  console.log(password == password2)
  let btnSingUp = document.getElementById('btnSingUp');
  if(password.value != password2.value){
    e.target.classList.remove('border-gray-500')
    e.target.classList.remove('border-green-500')
    e.target.classList.add('border-red-500')
    btnSingUp.disabled = true;
    // password2.classList.add('border-red-500')
  }else{
    e.target.classList.remove('border-gray-500')
    e.target.classList.remove('border-red-500')
    e.target.classList.add('border-green-500')
    btnSingUp.disabled = false;
    // password2.classList.add('border-green-500')
  }
}
</script>

<template>
    <div class="flex flex-col justify-center items-center m-auto h-screen">
        <!-- <img src="./imagenes/logo-ies2-edit5.png" alt="Si no carga la imagen" id="imagen_portada"><br> -->
        <h3 class="font-bold my-3 text-xl uppercase">Bazar online</h3>
        <h3 class="font-bold my-5 text-lg">Iniciar sesión</h3>
        <!-- <form action="http://localhost:3000/login/" method="post"> -->
        <form @submit="handleSubmit" class="border border-gray-500 rounded-md p-6">
          <label for="usuario" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Usuario: </label>
          <input type="text" name="username" v-model="username" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          <label for="contrasena" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Contraseña: </label>
          <input type="password" name="password" v-model="password" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          <label for="contrasena" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Repetir contraseña: </label>
          <input type="password" name="password2" v-model="password2" @input="handleTestPass" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
          <input type="submit" id="btnSingUp" value="Registrarse" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 my-4 mt-8 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled />
          <div class="text-center m-auto w-full underline">
            <a href="/login">Volver al login</a>
          </div>
        </form>
    </div>
</template>

<style scoped>
form input{
  width: 200px;
}
</style>
