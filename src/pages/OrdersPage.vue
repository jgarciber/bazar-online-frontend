<script setup>
import {ref, onMounted, watch} from 'vue';
import { ordersRepository } from '@/repositories/OrdersRepository.mjs';
import { getCookie, smoothScrollJS } from '@/functions.mjs';

const orders = ref([]);
const isAdmin = ref();
let searchKeyWord = ref();

// Variable para controlar el estado de carga
const isLoading = ref(false); // El spinner será visible al inicio  

function getOrders(){
  isLoading.value = true;
  ordersRepository.getOrdersAPI()
  .then(res => {
    orders.value = res;
  }).catch(error => {
    console.error("Error al obtener los pedidos:", error);
  })
  .finally(() => {
    isLoading.value = false; // Desactivar el spinner
  });
}

function handleSearchOrder(e){
  e.preventDefault();
  ordersRepository.searchOrdersAPI(searchKeyWord.value)
    .then(res => {
      orders.value = res;
    })
}

watch(searchKeyWord, (newValue) => {
  if (newValue.trim() === '') {
    getOrders();
  }
});

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getOrders();
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto my-6 w-5/6">
    <div>
      <form v-if="isAdmin" class="max-w-sm mx-auto" @submit="handleSearchOrder">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" v-model="searchKeyWord" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nº pedido..." required />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
        </div>
      </form>
      <br>

      <div class="flex flex-1 justify-center items-center">
        <div v-if="isLoading" class="spinner"></div>
        <div v-else-if="orders.length != 0" class="relative sm:rounded-md overflow-auto shadow-[10px_10px_5px_rgba(0,0,0,0.5)]">
          <table class="w-full text-md text-center rtl:text-right text-gray-800 dark:text-gray-400">
            <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>NºPedido</th>
                <th>Usuario</th>
                <th>Nºartículos</th>
                <th>Subtotal</th>
                <th>Descuento</th>
                <th>Subtotal con descuento</th>
                <th>Impuestos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td>{{order.id}}</td>
                <td>{{order.username}}</td>
                <td>{{order.total_articles}}</td>
                <td>{{order.subtotal}} &euro;</td>
                <td>({{order.discount}}%) {{order.calculated_discount}}&euro;</td>
                <td>{{order.subtotal_with_discount}} &euro;</td>
                <td>({{order.taxes}}%) {{order.calculated_taxes}}&euro;</td>
                <td>{{order.total}} &euro;</td>
              </tr> 
            </tbody>
          </table>
        </div>
        <h3 v-else class="mx-auto my-16 text-center">No hay ningún resultado</h3>
      </div>
    </div>
  </section>
</template>

<style scoped>
thead{
  border: solid;
  background-color: lightgreen
}
table tr:hover{
  background-color: lightblue;
}
label{
  width: 100px;
  display: inline-block;
}
nav ul{
  list-style-type: none;
  text-decoration: none;
}
nav li{
  display: inline-block;
  padding-left: 30px;
}
#productsCart{
  text-decoration: none;
  list-style: none;
}
form.anadir-producto label, form.anadir-producto input, form.anadir-producto textarea, form.anadir-producto select{
  border: solid;
  border-width: 1px;
  width: 200px;
  padding: 0;
}
table td{
  padding: 5px;
}
table, table td, table th{
  border: solid;
}
</style>