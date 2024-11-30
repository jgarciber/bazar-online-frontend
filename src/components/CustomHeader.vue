<script setup>
import NavHeaderItem from './NavHeaderItem.vue';
import ArrowDown2 from '@/icons/ArrowDown2.vue';
import { ref, onMounted } from 'vue';
const isAdmin = ref();

function init(){
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
}
onMounted(init);

</script>

<template>
    <div id="fondo-header" class="bg-cover h-20 flex items-center justify-center">
        <h1 class="font-bold my-auto shadow-lg shadow-slate-700 rounded-md border-2 p-2 text-3xl">BAZAR ONLINE</h1>
    </div>
    <header class="w-full min-h-14 bg-amber-200 flex items-center px-4 py-2">
        <nav class="h-full w-full">
            <ul class="flex flex-row flex-wrap gap-4 text-md md:text-xl xl:text-2xl uppercase font-semibold items-center h-full">
                <NavHeaderItem href="/products">Productos</NavHeaderItem>
                <NavHeaderItem href="/categories">Categorias</NavHeaderItem>
                <NavHeaderItem href="/sales">Ventas</NavHeaderItem>
                <NavHeaderItem href="/users">Usuarios</NavHeaderItem>
                <NavHeaderItem href="/orders">Pedidos</NavHeaderItem>
                <NavHeaderItem href="/logout">Salir</NavHeaderItem>
            </ul>
        </nav>
    </header>
    <ArrowDown2 id="bt-scroll-top" class="w-8 h-8 z-10 "/>
</template>

<style scoped>
#fondo-header{
    background-image: url(../images/StockCake-Golden-Geometric-Patterns_1731692181.jpg);
}
</style>