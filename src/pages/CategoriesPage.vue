<script setup>
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
// import CustomHeader from './components/CustomHeader.vue';
import {ref, onMounted, nextTick} from 'vue';
import { categoriesRepository } from '../repositories/CategoriesRepository.mjs';
import { getCookie, smoothScrollJS } from '@/functions.mjs';

// const message = ref('Hello vue!');
const categories = ref([]);
const isEditingCategory = ref(false);
const isAdmin = ref();
let newCategoryName = ref('');
let newCategoryDescription = ref('');

function getCategories(){
  categoriesRepository.getCategoriesAPI()
  .then(res => {
    categories.value = res;
  })
}

function postCategory(category){
  categoriesRepository.postCategoryAPI(category)
  .then(res => {
    if(res.message != '') alert(res.message);
    getCategories();
    isEditingCategory.value = false;
  })
}

function putCategory(modifiedCategory){
  categoriesRepository.putCategoryAPI(modifiedCategory)
  .then(res => {
    if(res.message != '') alert(res.message);
    getCategories();
    isEditingCategory.value = false;
  })
} 

function deleteCategory(id){
  categoriesRepository.deleteCategoryAPI(id)
  .then(res => {
    if(res.message != '') alert(res.message);
    getCategories();
    cancelarFormularioCategoria();
  })
}

function handleSubmit(e){
  e.preventDefault();
  const newCategory = Object.fromEntries(new FormData(e.target).entries());
  isEditingCategory.value ? putCategory(newCategory) : postCategory(newCategory);
  e.target.reset();
}

function handleModify(category){
  isEditingCategory.value = true;
  document.getElementById("idCategory").value = category.id;
  newCategoryName.value = category.name;
  newCategoryDescription.value = category.description;
  smoothScrollJS('formCategory');
}

function handleDelete(category){
  if (confirm(`¿Está seguro que quiere borrar la categoría "${category.name}"?`)) deleteCategory(category.id);
}

function cancelarFormularioCategoria(){
  formCategory.reset();
  newCategoryName.value = '';
  newCategoryDescription.value = '';
  isEditingCategory.value = false;
}

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getCategories();
    // let btnCancelarFormProducto = document.getElementById("btnCancelarFormProducto");
    // btnCancelarFormProducto.style.display = "none";
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    // isAdmin.value =  true;
    //la función nextTick se ejecuta una vez que se ha renderizado el DOM, pudiendo así capturar sus diferentes elementos que de otro modo no existirían, ya que para mostrarlos he utilizado v-if que los mostraban en función de una variable.
    nextTick(() => {
      if (isAdmin.value){
        let formCategory = document.getElementById("formCategory");
      }
    });
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto w-5/6 overflow-auto">
    <div class="my-6 relative overflow-x-auto sm:rounded-md">
      <table class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
        <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th v-if="isAdmin">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td>{{category.name}}</td>
            <td>{{category.description}}</td>
            <td v-if="isAdmin">
              <GenericBlueButton class="m-0.5" @click="handleModify(category)">Modificar</GenericBlueButton>
              <GenericRedButton class="m-0.5" @click="handleDelete(category)">Borrar</GenericRedButton>
            </td>
          </tr> 
        </tbody>
      </table>
    </div>

    <hr>
  
    <div class="my-6" v-if="isAdmin">
      <!-- <form @submit="handleSubmit" id="formProducto" @keydown="mostrarBtnCancelar" @input="mostrarBtnCancelar"> -->
      <form @submit="handleSubmit" id="formCategory">
        <fieldset class="flex flex-col items-center border-2 border-solid border-black p-3 rounded-lg bg-orange-400 gap-1">
          <legend v-if="isEditingCategory==false" class="text-lg font-semibold">Añadir categoría</legend>
          <legend v-else class="text-lg font-semibold">Modificar categoría</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idCategory" style="display:none;">
          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="name" class="border border-solid border-black">Nombre</label>
            <input type="text" v-model="newCategoryName" name="name" id="newCategoryName" required>
          </div>
          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="description" class="border border-solid border-black">Descripción</label>
            <textarea v-model="newCategoryDescription" name="description" id="newCategoryDescription" rows="5" required></textarea>
          </div>
          <br><br>
          <input v-if="isEditingCategory==false" type="submit" value="Añadir categoría" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <input v-else type="submit" value="Modificar categoría" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <GenericRedButton v-if="newCategoryName != '' || newCategoryDescription != ''" type="button" @click="cancelarFormularioCategoria" id="btnCancelarAdminForm">Cancelar</GenericRedButton>
        </fieldset>
      </form>
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
form label, form input, form textarea{
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
