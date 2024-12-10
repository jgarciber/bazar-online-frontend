<script setup>
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
import {ref, onMounted, nextTick} from 'vue';
import { categoriesRepository } from '../repositories/CategoriesRepository.mjs';
import { getCookie, smoothScrollJS } from '@/functions.mjs';

const categories = ref([]);
const isEditingCategory = ref(false);
const isAdmin = ref();
let newCategoryName = ref('');
let newCategoryDescription = ref('');

// Variable para controlar el estado de carga
const isLoading = ref(false); // El spinner será visible al inicio

function getCategories(){
  isLoading.value = true;
  categoriesRepository.getCategoriesAPI()
  .then(res => {
    categories.value = res;
  }).catch(error => {
    console.error("Error al obtener las categorías:", error);
  })
  .finally(() => {
    isLoading.value = false; // Desactivar el spinner
  });
}

function postCategory(category){
  categoriesRepository.postCategoryAPI(category)
  .then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getCategories();
      isEditingCategory.value = false;
      cancelarFormularioCategoria();
    }
  })
}

function putCategory(modifiedCategory){
  categoriesRepository.putCategoryAPI(modifiedCategory)
  .then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getCategories();
      isEditingCategory.value = false;
      cancelarFormularioCategoria();
    }
  })
} 

function deleteCategory(id){
  categoriesRepository.deleteCategoryAPI(id)
  .then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getCategories();
      cancelarFormularioCategoria();
    }
  })
}

function handleSubmit(e){
  e.preventDefault();
  const newCategory = Object.fromEntries(new FormData(e.target).entries());
  isEditingCategory.value ? putCategory(newCategory) : postCategory(newCategory);
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
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    // La función nextTick se ejecuta después de que el DOM ha sido completamente renderizado, lo que permite acceder a sus elementos, los cuales no estarían disponibles de otra manera. Esto es particularmente útil cuando se utilizan directivas como v-if, que muestran elementos condicionalmente según el valor de una variable.
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
  <section class="mx-auto w-5/6">
    <div class="flex flex-1 justify-center items-center">
      <div v-if="isLoading" class="spinner"></div>
      <div v-else-if="categories.length != 0" class="my-6 relative overflow-x-auto sm:rounded-md shadow-lg shadow-[10px_10px_5px_rgba(0,0,0,0.5)]">
        <table class="w-full text-md text-center rtl:text-right text-gray-800 dark:text-gray-400">
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
      <h3 v-else class="mx-auto my-16">No hay ninguna categoría</h3>
    </div>

    <hr>
  
    <div class="my-6" v-if="isAdmin">
      <form @submit="handleSubmit" id="formCategory">
        <fieldset class="flex flex-col items-center gap-1 border-2 border-solid border-black p-3 rounded-lg bg-gradient-to-b from-orange-400 to-amber-300 shadow-lg shadow-[15px_15px_5px_rgba(0,0,0,0.6)]">
          <legend v-if="isEditingCategory==false" class="text-lg font-semibold">Añadir categoría</legend>
          <legend v-else class="text-lg font-semibold">Modificar categoría</legend>

          <input type="text" name="id" id="idCategory" style="display:none;">

          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="name" class="border border-solid border-black">Nombre</label>
            <input type="text" v-model="newCategoryName" name="name" id="newCategoryName" title="El nombre de la categoría debe tener al menos 3 caracteres" required>
          </div>

          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="description" class="border border-solid border-black">Descripción</label>
            <textarea v-model="newCategoryDescription" name="description" id="newCategoryDescription" rows="5" title="La descripción debe tener al menos 10 caracteres" required></textarea>
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
</style>
