<script setup>
import {ref, onMounted, watch} from 'vue';
import { salesRepository } from '../repositories/SalesRepository.mjs';
import { getCookie } from '@/functions.mjs';

const sales = ref([]);
let searchKeyWord = ref();
let searchBy = ref();
let selectedRange = ref();
let startDate = ref ("");
let endDate = ref ("");
const isAdmin = ref();

function getSales(){
  salesRepository.getSalesAPI()
  .then(res => {
    sales.value = res;
  })
}

function handleSearch(e){
  e.preventDefault();
  salesRepository.searchSalesAPI(searchKeyWord.value, searchBy.value, startDate.value, endDate.value)
    .then(res => {
      sales.value = res;
    })
}

watch(searchKeyWord, (newValue) => {
  if (newValue.trim() === '') {
    getSales();  // Llamamos a getSales cuando el valor está vacío
  }
});

// Método para actualizar las fechas según la opción seleccionada
function updateDates() {
  const today = new Date();

  switch (selectedRange.value) {
    case "all":
      // Todas las fechas son válidas
      //La fecha más antigua posible
      startDate.value = formatDate(new Date(0));
      endDate.value = formatDate(today);
      break;
    case "today":
      // Hoy
      startDate.value = formatDate(today);
      endDate.value = formatDate(today);
      break;
    case "week":
      // Una semana atrás
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      startDate.value = formatDate(weekAgo);
      endDate.value = formatDate(today);
      break;
    case "month":
      // Un mes atrás
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      startDate.value = formatDate(monthAgo);
      endDate.value = formatDate(today);
      break;
    case "threeMonths":
      // Tres meses atrás
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      startDate.value = formatDate(threeMonthsAgo);
      endDate.value = formatDate(today);
      break;
    case "year":
      // Un año atrás
      const yearAgo = new Date(today);
      yearAgo.setFullYear(today.getFullYear() - 1);
      startDate.value = formatDate(yearAgo);
      endDate.value = formatDate(today);
      break;
    default:
      // En caso de que no se seleccione nada
      startDate.value = "";
      endDate.value = "";
  }
}

// Función para dar formato a la fecha (YYYY-MM-DD)
function formatDate(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Los meses comienzan desde 0
  let dd = date.getDate();

  // Asegurarse de que el mes y el día sean de dos dígitos
  if (mm < 10) mm = "0" + mm;
  if (dd < 10) dd = "0" + dd;

  return `${yyyy}-${mm}-${dd}`;
}

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    getSales();
    searchBy.value = 'product';
    selectedRange.value = 'all';
    updateDates();
  }
};
onMounted(init);
</script>

<!-- <script src="./node_modules/flowbite/dist/flowbite.min.js" defer></script> -->

<template>
  <section class="mx-auto my-6 w-5/6 relative overflow-x-auto sm:rounded-md">
    <form v-if="isAdmin" class="max-w-lg mx-auto mb-6" @submit="handleSearch">
      <fieldset class="border-2 border-solid border-gray-300 p-4 rounded-lg bg-gray-50">
        <legend class="text-left text-lg font-semibold">Búsqueda avanzada</legend>
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
              <option value="user">Usuario</option>
              <option value="order">Pedido</option>
              <option value="product">Producto</option>
              <option value="category">Categoría</option>
              <!-- <option value="date">Fecha</option> -->
            </select>
          </div>
          <div class="relative w-full">
              <input type="search" id="search-dropdown" v-model="searchKeyWord" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Buscar ventas filtradas por usuario, categoría ..." />
              <!-- <button type="submit" class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                  <span class="sr-only">Search</span>
              </button> -->
          </div>
        </div>
        <br>
        <!-- Radio buttons para seleccionar rango de fechas -->
        <div class="flex flex-col w-full">
          <label for="dateRange" class="text-left mb-2">Rango de fechas</label>
          <div>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="all" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Todas</span>
            </label>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="today" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Hoy</span>
            </label>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="week" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Una semana</span>
            </label>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="month" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Un mes</span>
            </label>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="threeMonths" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Tres meses</span>
            </label>
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="year" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Un año</span>
            </label>
          </div>
        </div>

        <div class="flex gap-4">
          <!-- Fecha de inicio -->
          <div class="flex flex-col w-full">
            <label for="startDate" class="text-left">Fecha de inicio</label>
            <input type="date" id="startDate" v-model="startDate" class="p-2.5 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500" required />
          </div>

          <!-- Fecha de fin -->
          <div class="flex flex-col w-full">
            <label for="endDate" class="text-left">Fecha de fin</label>
            <input type="date" id="endDate" v-model="endDate" class="p-2.5 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500" required />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700">
            Buscar
          </button>
        </div>
      </fieldset>
    </form>
        
    <table v-if="sales.length != 0" class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
        <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Usuario</th>
            <th>Pedido</th>
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
            <td>{{venta.order_id}}</td>
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
  /* width: 100px; */
  /* display: inline-block; */
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
  /* border: solid;
  border-width: 1px; */
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
