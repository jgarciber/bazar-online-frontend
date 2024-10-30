<script setup>
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
// import CustomHeader from './components/CustomHeader.vue';
import {ref, onMounted} from 'vue';
import { categoriesRepository } from '../repositories/CategoriesRepository.mjs';

// const message = ref('Hello vue!');
const categories = ref([]);
const isEditingCategory = ref(false);

function getCategories(){
  categoriesRepository.getCategoriesAPI()
  .then(res => {
    categories.value = res;
  })
}

function postCategory(category){
  categoriesRepository.postCategoryAPI(category)
  .then(res => {
    getCategories();
    isEditingCategory.value = false;
  })
}

function putCategory(modifiedCategory){
  categoriesRepository.putCategoryAPI(modifiedCategory)
  .then(res => {
    getCategories();
    isEditingCategory.value = false;
  })
} 

function deleteCategory(id){
  categoriesRepository.deleteCategoryAPI(id)
  .then(res => {
    getCategories();
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
  document.getElementById("newCategoryName").value = category.name;
  document.getElementById("newCategoryDescription").value = category.description;
}

function handleDelete(categoryId){
  deleteCategory(categoryId);
}

function cancelarFormularioCategoria(){
  document.getElementById("formCategory").reset();
  isEditingCategory.value = false;
}

function init(){
  getCategories();
  // let btnCancelarFormProducto = document.getElementById("btnCancelarFormProducto");
  // btnCancelarFormProducto.style.display = "none";
};
onMounted(init);

</script>

<template>
  <section class="mx-auto">
    <div class="my-6">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories">
            <td>{{category.name}}</td>
            <td>{{category.description}}</td>
            <td>
              <GenericBlueButton @click="handleModify(category)">Modificar</GenericBlueButton>
              <GenericRedButton @click="handleDelete(category.id)">Borrar</GenericRedButton>
            </td>
          </tr> 
        </tbody>
      </table>
    </div>

    <hr>
  
    <div class="bg-orange-400 my-6">
      <!-- <form @submit="handleSubmit" id="formProducto" @keydown="mostrarBtnCancelar" @input="mostrarBtnCancelar"> -->
      <form @submit="handleSubmit" id="formCategory">
        <fieldset class="border-2 border-solid border-black p-3">
          <legend v-if="isEditingCategory==false" class="text-lg font-semibold">Añadir categoría</legend>
          <legend v-else class="text-lg font-semibold">Modificar categoría</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idCategory" style="display:none;">
          <label for="name" class="border border-solid border-black">Nombre</label><input type="text" name="name" id="newCategoryName" required><br>
          <label for="description">Descripción</label><textarea name="description" id="newCategoryDescription" required></textarea><br>
          <input v-if="isEditingCategory==false" type="submit" value="Añadir categoría" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <input v-else type="submit" value="Modificar categoría" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <GenericRedButton @click="cancelarFormularioCategoria" id="btnCancelarFormProducto">Cancelar</GenericRedButton>
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
