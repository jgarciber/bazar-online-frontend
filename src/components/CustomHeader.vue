<script setup>
import NavHeaderItem from './NavHeaderItem.vue';
import { ref, onMounted } from 'vue';
const isAdmin = ref();

import ArrowDown from '@/icons/ArrowDown.vue';
import ArrowDown2 from '@/icons/ArrowDown2.vue';

function init(){
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
}
onMounted(init);

</script>

<template>
    <!-- <h1 class="bg-green-500 font-bold mx-auto rounded-lg shadow-lg shadow-gray-600 text-xl p-4 text-center">PRODUCT API REST</h1> -->
    <!-- <h1 class="bg-green-500 font-bold mx-auto rounded-lg shadow-lg shadow-gray-600 text-xl p-4 text-center">BAZAR ONLINE</h1> -->
    <!-- <div id="prueba" style="background-image: url('../images/StockCake-Automated-Warehouse-Navigation_1731690260.jpg')"> -->
    <div id="fondo-header" class="bg-cover h-20 flex items-center justify-center">
        <h1 class="font-bold my-auto shadow-lg shadow-slate-700 rounded-md border-2 p-2 text-3xl">BAZAR ONLINE</h1>
    </div>
    <!-- <header class="w-full min-h-14 bg-orange-400 flex items-center px-4 py-2"> -->
    <header class="w-full min-h-14 bg-amber-200 flex items-center px-4 py-2">
        <nav class="h-full">
            <ul class="flex flex-row flex-wrap gap-4 text-md md:text-xl xl:text-2xl uppercase font-semibold items-center h-full">
                <NavHeaderItem href="/products">Productos</NavHeaderItem>
                <NavHeaderItem href="/categories">Categorias</NavHeaderItem>
                <NavHeaderItem href="/sales">Ventas</NavHeaderItem>
                <NavHeaderItem href="/users">Usuarios</NavHeaderItem>
                <NavHeaderItem href="/logout">Salir</NavHeaderItem>
                <!-- <NavHeaderItem href="/charts-sales">Gráficos de ventas</NavHeaderItem> -->
            </ul>
        </nav>
    </header>
    <!-- <ArrowDown class="text-black w-8 h-auto hover:text-orange-500 transition-colors" /> -->
    <!-- <ArrowDown id="bt-scroll-top" class="w-6 h-6 z-10 border rounded-lg "/> -->
    <ArrowDown2 id="bt-scroll-top" class="w-8 h-8 z-10 "/>
</template>

<style scoped>
#fondo-header{
    /* background-image: url(../images/StockCake-Automated-Warehouse-Navigation_1731690260.jpg); */
    background-image: url(../images/StockCake-Golden-Geometric-Patterns_1731692181.jpg);
    /* background-repeat: no-repeat; */
    /* background-size: 100% auto; */
    /* font-family: Copperplate; */
}

header{
    /* background-color: #247291; */
}
</style>