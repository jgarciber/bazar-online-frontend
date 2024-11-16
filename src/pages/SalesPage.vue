<script setup>
import {ref, onMounted} from 'vue';
import { salesRepository } from '../repositories/SalesRepository.mjs';
import { getCookie } from '@/functions.mjs';

const sales = ref([]);
let searchKeyWord = ref();
let searchBy = ref();

function getSales(){
  salesRepository.getSalesAPI()
  .then(res => {
    sales.value = res;
  })
}

function handleSearch(e){
  console.log(searchKeyWord.value)
  console.log(searchBy.value)
  e.preventDefault();
  salesRepository.searchSalesAPI(searchKeyWord.value, searchBy.value)
    .then(res => {
      sales.value = res;
    })
}

function testEmptySearch(){
  if(searchKeyWord.value == '') getSales();
}

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getSales();
  }
};
onMounted(init);
</script>

<!-- <script src="./node_modules/flowbite/dist/flowbite.min.js" defer></script> -->

<template>
  <section class="mx-auto my-6 w-5/6 relative overflow-x-auto sm:rounded-md">
    <form class="max-w-lg mx-auto mb-6" @submit="handleSearch" @keydown="testEmptySearch">
      <div class="flex">
          <!-- <label for="search-dropdown" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
          <button id="dropdown-button" data-dropdown-toggle="dropdown" class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">Todas las ventas <svg class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>
          </button>
          <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
              <li>
                  <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="handleSearch($event, 'user')">Usuario</button>
              </li>
              <li>
                  <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="handleSearch($event, 'product')">Producto</button>
              </li>
              <li>
                  <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="handleSearch($event, 'category')">Categoría</button>
              </li>
              <li>
                  <button type="button" class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="handleSearch($event, 'date')">Fecha</button>
              </li>
              </ul>
          </div> -->
          <div>
            <select name="searchBy" id="searchBy" v-model="searchBy">
              <!-- <option value="all" disabled>--</option> -->
              <option value="user" selected>Usuario</option>
              <option value="product">Producto</option>
              <option value="category">Categoría</option>
              <option value="date">Fecha</option>
            </select>
          </div>
          <div class="relative w-full">
              <input type="search" id="search-dropdown" v-model="searchKeyWord" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Buscar ventas filtradas por usuario, categoría ..." />
              <button type="submit" class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                  <span class="sr-only">Search</span>
              </button>
          </div>
      </div>
    </form>
    
    <table v-if="sales.length != 0" class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
        <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Fecha venta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in sales" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td>{{venta.username}}</td>
            <td>{{venta.name}}</td>
            <td>{{venta.category}}</td>
            <td>{{venta.quantity}}</td>
            <td>{{venta.price}}</td>
            <td>{{venta.total}}</td>
            <td>{{new Date(venta.sale_date).toLocaleString()}}</td>
          </tr>
        </tbody>
    </table>
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
form label, form input, form textarea{
  border: solid;
  border-width: 1px;
}
table, table td, table th{
  border: solid;
}
table td{
  padding: 5px;
}
section{
  /* display: flex; */
  /* flex-direction: row; */
}
 header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
