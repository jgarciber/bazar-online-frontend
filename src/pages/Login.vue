<script setup>
import { loginRepository } from '@/repositories/LoginRepository';
import {ref} from 'vue';
import Eye from '@/icons/Eye.vue';
import ClosedEye from '@/icons/ClosedEye.vue';

const username = ref('');
const password = ref('');
let passwordVisible = ref(false);

function getUserLogin(userTryingToLog){
    loginRepository.getUserLoginAPI(userTryingToLog).then(res => {
      if(res.rows != undefined){
        sessionStorage.setItem('user_id', res.rows[0].id);
        sessionStorage.setItem('username', res.rows[0].username);
        sessionStorage.setItem('is_admin', res.rows[0].is_admin);
        // set token in cookie
        document.cookie = `token=${res.token}`
        window.location.href = '/products';
      }else{
        alert(res.error);
        sessionStorage.setItem('user_id', '');
        sessionStorage.setItem('username', '');
        sessionStorage.setItem('is_admin', 0);
      }
    }
  )
}

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

function handleSubmit(e){
  e.preventDefault();
  if (!e.target.checkValidity()) {
    return e.preventDefault(); // Prevenir el envío del formulario si no es válido
  }
  const userTryingToLog = Object.fromEntries(new FormData(e.target).entries());
  getUserLogin(userTryingToLog)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center m-auto h-screen">
        <!-- <h3 class="font-bold my-3 text-xl uppercase">Bazar online</h3> -->
        <img src="../images/soap-bubble-1958650_1280.svg" alt="Logo Bazar Online" class="w-52 y-52">
        <h3 class="font-bold my-2 text-lg">Iniciar sesión</h3>
        <form @submit="handleSubmit" class="border border-gray-500 rounded-md p-6">
          <label for="usuario" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Usuario: </label>
          <input type="text" name="username" v-model="username" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$" 
          title="El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números o guiones bajos. Debe comenzar y terminar con una letra o número, y no puede empezar ni terminar con un guion bajo." 
          required/>

          <label for="contrasena" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Contraseña: </label>
          <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" name="password" v-model="password" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            <!-- Botón para mostrar/ocultar la contraseña -->
            <Eye v-if="!passwordVisible" @click="togglePasswordVisibility" class="absolute right-3 top-3 w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"></Eye>
            <ClosedEye v-else @click="togglePasswordVisibility" class="absolute right-3 top-3 w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"></ClosedEye>
          </div>

          <input type="submit" id="btnEntrar" value="Entrar" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 my-4 mt-8 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" />
          <div class="text-center m-auto w-full underline">
            <a href="/signup">Registrarse</a>
          </div>
        </form>
    </div>
</template>

<style scoped>
form input{
  width: 200px;
}
</style>
