<script setup>
import NavHeaderItem from './NavHeaderItem.vue';
</script>

<template>
    <header class="w-full h-14 bg-orange-400 flex items-center px-4 py-2">
        <nav class="h-full">
            <ul class="flex flex-row gap-4 text-md md:text-xl xl:text-2xl uppercase font-semibold items-center h-full">
                <NavHeaderItem href="/products">Productos</NavHeaderItem>
                <NavHeaderItem href="/sales">Ventas</NavHeaderItem>
                <!-- <NavHeaderItem href="/charts-sales">Gráficos de ventas</NavHeaderItem> -->
                
            </ul>
        </nav>
    </header>

</template>