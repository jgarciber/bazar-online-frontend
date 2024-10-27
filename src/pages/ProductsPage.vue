<script setup>
import GenericButton from '../components/GenericButton.vue';
import GenericGreenButton from '@/components/GenericGreenButton.vue';
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
// import CustomHeader from './components/CustomHeader.vue';
import {ref, onMounted} from 'vue';
import { productsRepository } from '../repositories/ProductsRepository.mjs';
import { salesRepository } from '../repositories/SalesRepository.mjs';

// const message = ref('Hello vue!');
const products = ref([]);
const sales = ref([]);
const productsCart = ref([]);

function getProducts(){
  productsRepository.getProductsAPI()
  .then(res => {
    products.value = res;
  })
}

function postProduct(product){
  productsRepository.postProductAPI(product)
  .then(res => {
    getProducts();
    isEditingProduct = false;
  })
}

function postSale(product, quantity){
  salesRepository.postSaleAPI(product, quantity)
  .then(res => {
    // getSales();
    isEditingProduct = false;
  })
}

function putProduct(modifiedProduct){
  productsRepository.putProductAPI(modifiedProduct)
  .then(res => {
    getProducts();
    isEditingProduct = false;
  })
} 

function deleteProducts(id){
  productsRepository.deleteProductAPI(id)
  .then(res => {
    getProducts();
  })
}

let isEditingProduct = false;

function handleSubmit(e){
  e.preventDefault();
  const newProduct = Object.fromEntries(new FormData(e.target).entries());
  // console.log(newProduct);
  isEditingProduct ? putProduct(newProduct) : postProduct(newProduct);
  e.target.reset();
  productsCart.value = [];
  mostrarBtnCancelar();
}

function handleModify(product){
  isEditingProduct = true;
  // const form = document.getElementById("formProducto");
  document.getElementById("newProductPrice").value = product.price;
  document.getElementById("newProductName").value = product.name;
  document.getElementById("newProductStock").value = product.stock;
  document.getElementById("newProductCategory").value = product.category;
  document.getElementById("idProduct").value = product.id;
}

function handleDelete(productId){
  deleteProducts(productId);
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

  let arrayPromesas = [];
  for (let product of productsCart.value){
    arrayPromesas.push(postSale(product, product.quantity));
  }

  Promise.all(arrayPromesas).then(
    () => {
    for (let product of productsCart.value){
      productsCart.value.forEach((p) => {if(p.id == product.id) product.stock -= product.quantity })
      putProduct(product);
    }
      productsCart.value = []
    }
  );
}

function handleVaciarCarrito(){
  productsCart.value = [];
}

function cancelarFormularioProducto(){
  document.getElementById("formProducto").reset();
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
  let formInputs =  document.querySelectorAll("#formProducto input[type=text], #formProducto input[type=number] ");
  for (let input of formInputs) { 
    console.log(input.value)
    if (input.value) {
      btnCancelarFormProducto.style.display = "inline-block"; 
      return;
    }
  } 
  btnCancelarFormProducto.style.display = "inline-none";
}

function init(){
  getProducts();
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
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoria</th>
            <th>Acciones</th>
            <th>Encargar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products">
            <td>{{product.name}}</td>
            <td>{{product.price}}</td>
            
            <td>{{product.stock}}</td>
            <td>{{product.category}}</td>
            <td>
              <GenericBlueButton @click="handleModify(product)">Modificar</GenericBlueButton>
              <GenericRedButton @click="handleDelete(product.id)">Borrar</GenericRedButton>
            </td>
            <td><input type="number" name="cantidadAnadir" :id="'cantidadAnadir-'+product.id" min="1" :max="product.stock" value="1"><GenericGreenButton @click="handleAddProduct(product)">Añadir</GenericGreenButton></td>
          </tr> 
        </tbody>
      </table>
    </div>

    <div>
      <table v-if="productsCart.length != 0">
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
            <td colspan="5" style="text-align: center;">
                <GenericGreenButton @click="handleComprar">Comprar</GenericGreenButton>
                <GenericBlueButton @click="handleVaciarCarrito">Vaciar</GenericBlueButton>
            </td>
        </tr>
          <!-- <tr><td colspan="5" style="text-align: center;" ><button @click="handleComprar">Comprar</button></td></tr> -->
        </tfoot>
      </table>
    </div>
    <hr>
    <div class="bg-orange-400 my-6">
      <!-- <form @submit="handleSubmit" id="formProducto" @keydown="mostrarBtnCancelar" @input="mostrarBtnCancelar"> -->
      <form @submit="handleSubmit" id="formProducto">
        <fieldset class="border-2 border-solid border-black p-3">
          <legend class="text-lg font-semibold">Modicar producto</legend>
          <!-- <h3 class="text-lg font-semibold">Modicar producto</h3> -->
          <input type="text" name="id" id="idProduct" style="display:none;">
          <label for="name" class="border border-solid border-black">Nombre</label><input type="text" name="name" id="newProductName" required><br>
          <label for="price">Precio</label><input type="number" name="price" id="newProductPrice" min="0" step="0.01" required><br>
          <label for="stock">Stock</label><input type="number" name="stock" id="newProductStock" min="1" required><br>
          <label for="categoria">Categoria</label><textarea name="category" id="newProductCategory" required></textarea><br>
          <input v-if="isEditingProduct == false" type="submit" value="Añadir producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <input v-else type="submit" value="Modificar producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <GenericRedButton @click="cancelarFormularioProducto" id="btnCancelarFormProducto">Cancelar</GenericRedButton>
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
