<script setup>
import { RouterLink } from 'vue-router';
defineProps(['href'])

</script>

<template>
    <li class="transition-all duration-300 hover:scale-110 hover:font-bold">
        <RouterLink :to="href" active-class="active-link"><slot/></RouterLink>
    </li>
</template>

<style scoped>
/* Define la clase personalizada para el enlace activo */
.active-link {
  color: brown;
  font-weight: bold;
}
</style>