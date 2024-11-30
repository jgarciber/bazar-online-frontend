<script setup>
import {onMounted, ref} from 'vue';
import { getCookie } from '@/functions.mjs';

function redireccionLogin(){
  window.location.href = '/login';
}

onMounted(init);
function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    //Para borrar un cookie se establece su fecha de expiración a una fecha ya pasada.
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    sessionStorage.clear();
    const myTimeout = setTimeout(redireccionLogin, 3000);
  }
}

</script>

<template>
  <h1 class="font-bold mx-auto my-8">Su sesión se ha cerrado correctamente, en unos segundos será redireccionado al login</h1>
</template>

<style scoped>

</style>
