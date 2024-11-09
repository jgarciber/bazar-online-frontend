<script setup>
import GenericGreenButton from '@/components/GenericGreenButton.vue';
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
// import CustomHeader from './components/CustomHeader.vue';
import {ref, onMounted, nextTick} from 'vue';
import { productsRepository } from '../repositories/ProductsRepository.mjs';
import { categoriesRepository } from '@/repositories/CategoriesRepository.mjs';
import { salesRepository } from '../repositories/SalesRepository.mjs';
import { getCookie } from '@/functions.mjs';

// const message = ref('Hello vue!');
const products = ref([]);
const categories = ref([]);
const productsCart = ref([]);
const isEditingProduct = ref(false);
const isAdmin = ref();
let newProductName = ref();
let newProductPrice = ref();
let newProductStock = ref();
let newProductCategory = ref();
let searchKeyWord = ref();


function getProducts(){
  productsRepository.getProductsAPI()
  .then(res => {
    products.value = res;
  })
}

function getCategories(){
  categoriesRepository.getCategoriesAPI()
  .then(res => {
    categories.value = res;
  })
}


function postProduct(product){
  productsRepository.postProductAPI(product)
  .then(res => {
    getProducts();
    isEditingProduct.value = false;
  })
}

function postSale(product, quantity){
  salesRepository.postSaleAPI(product, quantity)
  .then(res => {
    getProducts();
    isEditingProduct.value = false;
  })
}

function putProduct(modifiedProduct){
  productsRepository.putProductAPI(modifiedProduct)
  .then(res => {
    getProducts();
    isEditingProduct.value = false;
  })
} 

function deleteProducts(id){
  productsRepository.deleteProductAPI(id)
  .then(res => {
    getProducts();
  })
}

// let isEditingProduct = false;

function handleSubmit(e){
  e.preventDefault();
  console.log("ha llamado al submit del formulario")
  console.log(isEditingProduct.value)
  const newProduct = Object.fromEntries(new FormData(e.target).entries());
  // Hay que añadir manualmente el valor del campo select del formulario al objeto newProduct, ya que este no se incluye en el FormData por no ser de tipo input
  let newProductCategory = document.getElementById('newProductCategory');
  newProduct.categoryId = newProductCategory.value;
  // newProduct.category = newProductCategory.options[newProductCategory.selectedIndex].text;
  isEditingProduct.value ? putProduct(newProduct) : postProduct(newProduct);
  e.target.reset();
  productsCart.value = [];
  mostrarBtnCancelar();
}

function handleModify(product){
  formProducto.reset();
  isEditingProduct.value = true;
  // const form = document.getElementById("formProducto");
  // document.getElementById("newProductPrice").value = product.price;
  // document.getElementById("newProductName").value = product.name;
  // document.getElementById("newProductStock").value = product.stock;
  // document.getElementById("newProductCategory").value = product.category;
  // document.getElementById("idProduct").value = product.id;
  newProductName = product.name;
  newProductPrice = product.price;
  newProductStock = product.stock;
  newProductCategory = product.categoryId;
  document.getElementById("idProduct").value = product.id;
  mostrarBtnCancelar();
}

function handleDelete(product){
  if (confirm(`¿Está seguro que quiere borrar el producto "${product.name}"?`)) deleteProducts(product.id);
}

function handleAddProduct(product){
  // let target = { "quantity": quantity };
  // let source = { prop: "source prop", anotherProp: "anotherSourceProp" };
  // Object.assign(target, product);
  let btnId = "cantidadAnadir-"+product.id
  // Copio el objeto
  // const newProduct = {...product}
  let newProduct = Object.assign({}, product)
  newProduct.quantity = Number.parseFloat(document.getElementById(btnId).value);
  let productoExistenteCarrito = null;
  productoExistenteCarrito = productsCart.value.find(p => p.id == product.id);
  if (productoExistenteCarrito != null) {
    productoExistenteCarrito.quantity += newProduct.quantity;
  }else{
    productsCart.value.push(newProduct);
  }
}

function handleDeleteProductCart(index){
  // let indexProduct = productsCart.value.indexOf(product);
  // productsCart.splice(indexProduct,1);
  // productsCart.value = productsCart.value.filter((prod) => prod.id !== product.id)
  productsCart.value.splice(index, 1)
}

function handleComprar(){
  // for (let product of productsCart.value){
  //     let cantidadTotalProducto = productsCart.value.reduce((acum, curr) => {return parseInt(curr.quantity) + acum}, 0)
  //     console.log(cantidadTotalProducto)
  //     if (cantidadTotalProducto > product.stock){
  //         alert ("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito para continuar");
  //     return;
  //     }
  // }

  for (let product of productsCart.value){
    if (product.quantity > product.stock){
      alert ("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito para continuar");
      return;
    }
  }

  // let arrayPromesas = [];
  // for (let product of productsCart.value){
  //   arrayPromesas.push(postSale(product, product.quantity));
  // }

  // Promise.all(arrayPromesas).then(
  //   () => {
  //   for (let product of productsCart.value){
  //     productsCart.value.forEach((p) => {if(p.id == product.id) product.stock -= product.quantity })
  //     putProduct(product);
  //   }
  //     productsCart.value = []
  //   }
  // );
  for (let product of productsCart.value){
    postSale(product, product.quantity);
  }
  productsCart.value = []
}

function handleVaciarCarrito(){
  productsCart.value = [];
}

function cancelarFormularioProducto(){
  formProducto.reset();
  isEditingProduct.value = false;
  // mostrarBtnCancelar();
}

function mostrarBtnCancelar(){
  // let formulario =  document.getElementById("formProducto");
  // for (let i = 0; i < formulario.elements.length; i++) { 
  //   let element = formulario.elements[i]; 
  //   if (element.value) {
  //     btnCancelarFormProducto.style.display = "inline-block"; 
  //     return;
  //   }
  // } 

  
  // let formInputs =  document.querySelectorAll("#formProducto input[type=text], #formProducto input[type=number] ");
  // for (let input of formInputs) { 
  //   console.log(input.value)
  //   if (input.value) {
  //     btnCancelarFormProducto.style.display = "inline-block"; 
  //     return;
  //   }
  // } 
  // btnCancelarFormProducto.style.display = "inline-none";

  // console.log("nuevo")
  // console.log(newProductName.value)
  // console.log(newProductPrice.value)
  // console.log(newProductStock.value)
  // console.log(newProductName.value == '')
  // console.log(newProductPrice.value == undefined)
  // console.log(newProductPrice.value == '')
  // console.log(newProductStock.value == '')
  
  if (newProductName.value == '' && newProductPrice.value == '' && newProductStock.value == ''){
    btnCancelarFormProducto.style.display = "inline-none";
  }else{
    btnCancelarFormProducto.style.display = "inline-block";
  }
}

function handleSearchProduct(e){
  e.preventDefault();
  productsRepository.searchProductsAPI(searchKeyWord.value)
    .then(res => {
      products.value = res;
    })
}

function handleSearchCategory(e, category){
  Array.from(e.target.parentNode.children).map(li => li.classList.remove("bg-blue-200"));
  e.target.classList.add("bg-blue-200");
  if(category === 'todas') return getProducts();
  productsRepository.searchProductsByCategoryAPI(category.id)
    .then(res => {
      products.value = res;
    })
}

function testEmptySearch(){
  if(searchKeyWord.value == '') getProducts();
}

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    getProducts();
    getCategories();
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    //la función nextTick se ejecuta una vez que se ha renderizado el DOM, pudiendo así capturar sus diferentes elementos que de otro modo no existirían, ya que para mostrarlos he utilizado v-if que los mostraban en función de una variable.
    nextTick(() => {
      if (isAdmin.value){
        let btnCancelarFormProducto = document.getElementById("btnCancelarFormProducto");
        let formProducto = document.getElementById("formProducto");
        btnCancelarFormProducto.style.display = "none";
      }
    });
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto">
    <div class="my-6">
     
      <!-- <form class="flex items-center max-w-sm mx-auto" @submit="handleSearchProduct" @input="testEmptySearch">   
        <label for="simple-search" class="sr-only">Search</label>
        <div class="relative w-full">
          <input v-model="searchKeyWord" type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar productos" />
        </div>
        <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span class="sr-only">Search</span>
        </button>
      </form> -->

      <form class="max-w-md mx-auto" @submit="handleSearchProduct" @keydown="testEmptySearch">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" v-model="searchKeyWord" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Productos..." required />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>
      <br>

      <div class="flex flex-row flex-wrap justify-center">
        <ul class="mx-3 mb-3">
          <h3 class="font-semibold">CATEGORÍAS:</h3>
          <li class="mx-2 hover:bg-blue-200 list-none hover:list-disc" @click="handleSearchCategory($event, 'todas')">TODAS</li>
          <li v-for="category in categories" @click="handleSearchCategory($event, category)" class="mx-2 hover:bg-blue-200 list-none hover:list-disc">{{ category.name }}</li>
        </ul>

        <!-- <table v-if="products.length != 0" class="mx-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoria</th>
              <th v-if="isAdmin">Acciones</th>
              <th>Encargar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products">
              <td>{{product.name}}</td>
              <td>{{product.price}}</td>
              
              <td>{{product.stock}}</td>
              <td>{{product.categoryName}}</td>
              <td v-if="isAdmin">
                <GenericBlueButton @click="handleModify(product)">Modificar</GenericBlueButton>
                <GenericRedButton @click="handleDelete(product.id)">Borrar</GenericRedButton>
              </td>
              <td><input type="number" name="cantidadAnadir" :id="'cantidadAnadir-'+product.id" min="1" :max="product.stock" value="1"><GenericGreenButton @click="handleAddProduct(product)">Añadir</GenericGreenButton></td>
            </tr> 
          </tbody>
        </table> -->

        <div v-if="products.length != 0" class="relative overflow-x-auto sm:rounded-md">
          <table class="w-full text-md text-center rtl:text-right shadow-lg text-gray-800 dark:text-gray-400">
            <thead class="text-sm text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th v-if="isAdmin">Acciones</th>
                <th>Encargar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td>{{product.name}}</td>
                <td>{{product.price}}</td>
                
                <td>{{product.stock}}</td>
                <td>{{product.categoryName}}</td>
                <td v-if="isAdmin">
                  <GenericBlueButton @click="handleModify(product)">Modificar</GenericBlueButton>
                  <GenericRedButton @click="handleDelete(product)">Borrar</GenericRedButton>
                </td>
                <td><input type="number" name="cantidadAnadir" :id="'cantidadAnadir-'+product.id" min="1" :max="product.stock" value="1"><GenericGreenButton @click="handleAddProduct(product)">Añadir</GenericGreenButton></td>
              </tr> 
            </tbody>
          </table>
        </div>
        <h3 v-else class="mx-auto my-auto">No hay ningún resultado</h3>
      </div>
    </div>

    <div>
      <table v-if="productsCart.length != 0" class="mx-auto">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in productsCart">
            <td>{{product.name}}</td>
            <td>{{product.price}}</td>
            
            <td>{{product.quantity}}</td>
            <td>{{product.price * product.quantity}}</td>
            <td>
              <GenericRedButton @click="handleDeleteProductCart(index)">Borrar</GenericRedButton>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-center">
                <GenericGreenButton @click="handleComprar">Comprar</GenericGreenButton>
                <GenericBlueButton @click="handleVaciarCarrito">Vaciar</GenericBlueButton>
            </td>
        </tr>
          <!-- <tr><td colspan="5" style="text-align: center;" ><button @click="handleComprar">Comprar</button></td></tr> -->
        </tfoot>
      </table>
    </div>
    <hr>
    <div class="my-6" v-if="isAdmin">
      <form @submit="handleSubmit" id="formProducto" @input="mostrarBtnCancelar" class="mx-auto w-3/4 py-4 anadir-producto">
      <!-- <form @submit="handleSubmit" id="formProducto"> -->
        <fieldset class="text-center border-2 border-solid border-black p-3 rounded-lg bg-orange-400 ">
          <legend v-if="isEditingProduct == false" class="text-left text-lg font-semibold">Añadir producto</legend>
          <legend v-else class="text-left text-lg font-semibold">Modificar producto</legend>
          <!-- <h3 class="text-lg font-semibold">Modificar producto</h3> -->
          <input type="text" name="id" id="idProduct" hidden>
          <label for="newProductName" class="text-left border border-solid border-black">Nombre</label>
          <input v-model="newProductName" type="text" name="name" id="newProductName" required><br>
          <label for="newProductPrice" class="text-left">Precio</label>
          <input v-model="newProductPrice" type="number" name="price" id="newProductPrice" min="0" step="0.01" required><br>
          <label for="newProductStock" class="text-left">Stock</label>
          <input v-model="newProductStock" type="number" name="stock" id="newProductStock" min="1" required><br>
          <label for="newProductCategory" class="text-left">Categoria</label>
          <select id="newProductCategory" style="width: 200px;" v-model="newProductCategory" required>
            <option value="0" disabled>--</option>
            <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
          </select>
          <br><br>
          <input v-if="isEditingProduct == false" type="submit" value="Añadir producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <input v-else type="submit" value="Modificar producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <GenericRedButton type="button" @click="cancelarFormularioProducto" id="btnCancelarFormProducto">Cancelar</GenericRedButton>
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
form.anadir-producto label, form.anadir-producto input, form.anadir-producto textarea{
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
