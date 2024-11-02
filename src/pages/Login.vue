<script setup>
import { loginRepository } from '@/repositories/LoginRepository';
import {ref} from 'vue';

const username = ref();
const password = ref();

function getUserLogin(userTryingToLog){
    loginRepository.getUserLoginAPI(userTryingToLog).then(res => {
      if(res[0].username){
        sessionStorage.setItem('user', res[0].username);
        sessionStorage.setItem('is_admin', res[0].is_admin);
        window.location.href = '/products';
      }else{
        sessionStorage.setItem('user', '');
        sessionStorage.setItem('is_admin', 0);
      }
    }
  )
}

function postUserLogin(userTryingToRegister){
    loginRepository.postUserLoginAPI(userTryingToRegister).then(res => {
        alert(`Se ha registrado al usuario ${userTryingToRegister.username} correctamente`)
    })
}

function handleSubmit(e){
  e.preventDefault();
  const userTryingToLog = Object.fromEntries(new FormData(e.target).entries());
  (document.getElementById('btnEntrar').value == 'Entrar') ? getUserLogin(userTryingToLog) : postUserLogin(userTryingToLog) 
}

</script>

<template>
    <div class="flex flex-col justify-center items-center m-auto h-screen">
        <!-- <img src="./imagenes/logo-ies2-edit5.png" alt="Imagen_bienvenida_extranet" id="imagen_portada"><br> -->
        <h3 class="font-bold">Iniciar sesión</h3>
        <!-- <form action="http://localhost:3000/login/" method="post"> -->
        <form @submit="handleSubmit" class="bg-orange-300">
          <label for="usuario">Usuario: </label><br>
          <input type="text" name="username" v-model="username"/><br>
          <label for="contrasena">Contraseña: </label><br>
          <input type="password" name="password" v-model="password" /><br><br>
          <!-- <input type="submit" name="enviar" value="Entrar" class="border border-solid border-black p-1 rounded-md hover:bg-blue-400" /> -->
          <input type="submit" id="btnEntrar" value="Entrar" class="border border-solid border-black p-1 rounded-md hover:bg-green-400" /><br>
          <input type="submit" id="btnRegistrarse" value="Registrarse" class="border border-solid border-black p-1 rounded-md hover:bg-blue-400" />
        </form>
    </div>
</template>

<style scoped>
form input{
  border: solid;
  border-width: 1px;
  width: 200px;
}
</style>
