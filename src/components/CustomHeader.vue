<script setup>
import NavHeaderItem from './NavHeaderItem.vue';
import ArrowDown2 from '@/icons/ArrowDown2.vue';
import { ref, onMounted } from 'vue';
const isAdmin = ref();

function init(){
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    // handleUpdateCart();
}

import Cart from './Cart.vue';
import CartIcon from '@/icons/CartIcon.vue';
const hovering = ref(false); // Estado para controlar el hover

// function handleUpdateCart() {
//       // Emitir un evento personalizado para notificar sobre el cambio
//       console.log('disparado')
//       const event = new CustomEvent("cartUpdated", {
//         detail: { message: "Carrito actualizado" },
//       });
//       window.dispatchEvent(event); // Emitir el evento globalmente en la ventana
// }


onMounted(init);

</script>

<template>
    <div id="fondo-header" class="bg-cover h-20 flex items-center justify-center">
        <h1 class="font-bold my-auto shadow-lg shadow-slate-700 rounded-md border-2 p-2 text-3xl">BAZAR ONLINE</h1>
    </div>
    <header class="w-full min-h-14 bg-amber-200 flex items-center px-4 py-2 sticky top-0 z-10">
        <nav class="h-full w-full">
            <ul class="flex flex-row flex-wrap gap-4 text-md md:text-xl xl:text-2xl uppercase font-semibold items-center h-full">
                <NavHeaderItem href="/products">Productos</NavHeaderItem>
                <NavHeaderItem href="/categories">Categorias</NavHeaderItem>
                <NavHeaderItem href="/sales">Ventas</NavHeaderItem>
                <NavHeaderItem href="/users">Usuarios</NavHeaderItem>
                <NavHeaderItem href="/orders">Pedidos</NavHeaderItem>
                <NavHeaderItem href="/logout">Salir</NavHeaderItem>

                <!-- Carrito con hover -->
                <li class="relative ml-auto" @mouseenter="hovering = true" @mouseleave="hovering = false">
                    <span class="cursor-pointer"><CartIcon class="w-8 h-8"/></span>

                    <!-- Carrito flotante -->
                    <div v-if="hovering" class="fixed top-10 right-5 p-4 overflow-auto max-w-full max-h-96 bg-white shadow-lg rounded-lg opacity-100 transition-opacity duration-300 transform z-10 sm:max-w-full sm:left-auto">
                    <!-- <Cart @update-cart="handleUpdateCart"></Cart> -->
                        <Cart id="cart-nav"></Cart>
                    </div>
                </li>
            </ul>
        </nav>
    </header>
    <ArrowDown2 id="bt-scroll-top" class="w-8 h-8 z-10 "/>
</template>

<style scoped>
#fondo-header{
    background-image: url(../images/StockCake-Golden-Geometric-Patterns_1731692181.jpg);
}

#cart-nav *:not(button):not(svg) {
    font-size: 0.85rem;
    padding: 6px;
}
@media (max-width: 640px) {
    #cart-nav *:not(button):not(svg) {
        font-size: 0.75rem;
        padding: 3px;
    }
}
</style>