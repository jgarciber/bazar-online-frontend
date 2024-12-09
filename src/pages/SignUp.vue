<script setup>
import { loginRepository } from '@/repositories/LoginRepository';
import {ref, computed} from 'vue';
import Eye from '@/icons/Eye.vue';
import ClosedEye from '@/icons/ClosedEye.vue';

const username = ref();
let firstName = ref();
let lastName = ref();
let email = ref();
const password = ref();
const password2 = ref();
let passwordVisible = ref(false);

function postUserLogin(userTryingToRegister){
  loginRepository.postUserLoginAPI(userTryingToRegister).then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      window.location.href = '/login';
    }
  })
}

function handleSubmit(e){
  e.preventDefault();
  const userTryingToLog = Object.fromEntries(new FormData(e.target).entries());
  if (!username.value || !firstName.value || !lastName.value || !email.value || !password.value || !password2.value) {
    alert("Por favor, complete todos los campos.");
  }else if (!passwordsMatch.value) {
    alert("Las contraseñas no coinciden.");
  }else{
    postUserLogin(userTryingToLog);
  }
}

const passwordsMatch = computed(() => {
  return password.value === password2.value;
});

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}
</script>

<template>
    <div class="flex flex-col justify-center items-center mx-auto my-6">
        <h3 class="font-bold my-3 text-xl uppercase">Bazar online</h3>
        <h3 class="font-bold my-5 text-lg">Registro</h3>
        <form @submit="handleSubmit" class="border border-gray-500 rounded-md p-6">
          <label for="usuario" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Usuario: </label>
          <input type="text" name="username" v-model="username" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$" 
          title="El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números o guiones bajos. Debe comenzar y terminar con una letra o número, y no puede empezar ni terminar con un guion bajo." required/>

          <label for="first-name" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Nombre: </label>
          <input type="text" name="firstName" v-model="firstName" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑª]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑª]+)*$" title="El nombre puede contener varias palabras, solo con letras, tildes, ñ y el carácter ª, sin números ni caracteres especiales." required/>

          <label for="last-name" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Apellidos: </label>
          <input type="text" name="lastName" v-model="lastName" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑª]+(?: [a-zA-ZáéíóúÁÉÍÓÚñÑª]+)*$" title="Los apellidos pueden contener varias palabras, solo con letras, tildes, ñ y el carácter ª, sin números ni caracteres especiales." required/>

          <label for="email" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Correo: </label>
          <input type="email" name="email" v-model="email" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>

          <label for="contrasena" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Contraseña: </label>
          <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" name="password" v-model="password" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :class="{'!border-green-500': passwordsMatch, '!border-red-500': !passwordsMatch, '!border-2':true}" pattern="^.{8,}$" 
          title="La contraseña debe tener al menos 8 caracteres" required/>
            <Eye v-if="!passwordVisible" @click="togglePasswordVisibility" class="absolute right-3 top-3 w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"></Eye>
            <ClosedEye v-else @click="togglePasswordVisibility" class="absolute right-3 top-3 w-5 h-5 text-gray-500 hover:text-gray-700 focus:outline-none"></ClosedEye>
          </div>

          <label for="contrasena" class="block mb-1 text-md font-medium text-gray-900 dark:text-white">Repetir contraseña: </label>
          <input :type="passwordVisible ? 'text' : 'password'" name="password2" v-model="password2" class="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :class="{'!border-green-500': passwordsMatch, '!border-red-500': !passwordsMatch, '!border-2':true}" pattern="^.{8,}$" 
          title="La contraseña debe tener al menos 8 caracteres" required/>

          <input type="submit" id="btnSingUp" value="Registrarse" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 my-4 mt-8 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"/>
          
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
