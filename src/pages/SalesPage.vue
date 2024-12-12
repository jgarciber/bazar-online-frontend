<script setup>
import {ref, onMounted, watch} from 'vue';
import { salesRepository } from '../repositories/SalesRepository.mjs';
import { getCookie } from '@/functions.mjs';

const sales = ref([]);
let searchKeyWord = ref('');
let searchBy = ref();
let selectedRange = ref();
let startDate = ref ("");
let endDate = ref ("");
const isAdmin = ref();

// Variable para controlar el estado de carga
const isLoading = ref(false); // El spinner será visible al inicio  

function getSales(){
  isLoading.value = true;
  salesRepository.getSalesAPI()
  .then(res => {
    sales.value = res;
  }).catch(error => {
    console.error("Error al obtener las ventas:", error);
  })
  .finally(() => {
    isLoading.value = false; // Desactivar el spinner
  });
}

function handleSearch(e){
  e.preventDefault();
  let query = searchKeyWord.value.trim() || undefined;
  salesRepository.searchSalesAPI(query, searchBy.value, startDate.value, endDate.value)
    .then(res => {
      sales.value = res;
    })
}

watch(searchKeyWord, (newValue) => {
  if (newValue.trim() === '') {
    //Llamar a getSales() no sería del todo correcto, porque puede ser que se quiera obtener todas las ventas en un rango concreto de fechas.
    // Llamamos a handleSearch cuando el valor de searchKeyWord está vacío (no hay nada escrito en la barra de búsqueda)
    // Crear un evento ficticio con un preventDefault vacío
    let fakeEvent = {
      preventDefault: () => {} // Simula el método preventDefault
    };
    handleSearch(fakeEvent);  // Llamar a handleSearch con el evento ficticio
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

function handleModifyDate(){
  selectedRange.value = 'customized';
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
  <section class="mx-auto my-6 w-5/6 relative sm:rounded-md">
    <form v-if="isAdmin" class="max-w-lg mx-auto mb-6 overflow-auto" @submit="handleSearch">
      <fieldset class="border-2 border-solid border-gray-300 p-4 rounded-lg bg-gray-50">
        <legend class="text-left text-lg font-semibold">Búsqueda avanzada</legend>
        <div class="flex">
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
            <label class="inline-flex items-center mr-4">
              <input type="radio" name="dateRange" value="customized" v-model="selectedRange" @change="updateDates" class="form-radio" />
              <span class="ml-2">Personalizado</span>
            </label>
          </div>
        </div>

        <div class="flex gap-4">
          <!-- Fecha de inicio -->
          <div class="flex flex-col w-full">
            <label for="startDate" class="text-left">Fecha de inicio</label>
            <input type="date" id="startDate" v-model="startDate" @change="handleModifyDate" class="p-2.5 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500" required />
          </div>

          <!-- Fecha de fin -->
          <div class="flex flex-col w-full">
            <label for="endDate" class="text-left">Fecha de fin</label>
            <input type="date" id="endDate" v-model="endDate" @change="handleModifyDate" class="p-2.5 w-full text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500" required />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700">
            Buscar
          </button>
        </div>
      </fieldset>
    </form>

    <div class="flex flex-1 justify-center items-center">
      <div v-if="isLoading" class="spinner"></div>
      <div v-else-if="sales.length != 0" class="overflow-x-auto shadow-[10px_10px_5px_rgba(0,0,0,0.5)]">
        <table class="w-full text-md text-center rtl:text-right text-gray-800 dark:text-gray-400">
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
              <td v-if="venta.price != undefined" class="whitespace-nowrap">{{venta.price}} &euro;</td>
              <td v-else class="whitespace-nowrap">{{(venta.total/venta.quantity).toFixed(2)}} &euro;</td>
              <td>{{venta.total}} &euro;</td>
              <td>{{new Date(venta.sale_date).toLocaleString()}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 v-else class="mx-auto my-16 text-center">No hay ningún resultado</h3>
    </div>
  </section>
</template>

<style scoped>
thead{
  border: solid;
  background-color: lightgreen
}
th,td{
  padding: 6px;
}
table tr:hover{
  background-color: lightblue;
}
label{
  background-color: transparent;
}
table, table td, table th{
  border: solid;
}
table td{
  padding: 5px;
}
</style>
