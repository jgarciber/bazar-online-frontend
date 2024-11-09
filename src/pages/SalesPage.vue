<script setup>
import {ref, onMounted} from 'vue';
import { salesRepository } from '../repositories/SalesRepository.mjs';
import { getCookie } from '@/functions.mjs';

const sales = ref([]);

function getSales(){
  salesRepository.getSalesAPI()
  .then(res => {
    sales.value = res;
  })
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

<template>
  <section class="mx-auto my-6 relative overflow-x-auto sm:rounded-md">
    <table v-if="sales.length != 0" class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
        <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Fecha venta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in sales" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td>{{venta.name}}</td>
            <td>{{venta.price}}</td>
            <td>{{venta.quantity}}</td>
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
