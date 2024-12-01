<script setup>
import {onMounted} from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import CustomHeader from './components/CustomHeader.vue';
import CustomFooter from './components/CustomFooter.vue';
const route = useRoute();
const router = useRouter();

function init() {
  if (route.path === '/' && window.location.pathname !== '/login') {
    // window.location.href = '/login';
    router.push('/login');
  }
};
// onMounted(init)
</script>

<template>
  <CustomHeader v-if="route.path !== '/welcome' && route.path !== '/login' && route.path !== '/signup'"/>
  <main class="flex flex-1">
    <RouterView/>
  </main>
  <CustomFooter v-if="route.path !== '/welcome' && route.path !== '/login' && route.path !== '/signup'"/>
</template>