<script setup>
import {onMounted, ref} from 'vue';

function redireccionLogin(){
  window.location.href = '/login';
}

onMounted(init);
function init(){
  const myTimeout = setTimeout(redireccionLogin, 3000);
}

</script>

<template>
  <h1 class="font-bold mx-auto my-8">Su sesión se ha cerrado correctamente, en unos segundos será redireccionado al login</h1>
</template>

<style scoped>

</style>
