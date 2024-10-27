<script setup>
import { RouterLink } from 'vue-router';
defineProps(['href'])

</script>

<template>
    <li class="transition-all duration-300 hover:scale-110 hover:font-bold">
        <RouterLink :to="href"><slot/></RouterLink>
    </li>
</template>