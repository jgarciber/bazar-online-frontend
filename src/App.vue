<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import CustomHeader from './components/CustomHeader.vue';
import GenericButton from './components/GenericButton.vue';
// import CustomHeader from './components/CustomHeader.vue';
import {ref, onMounted} from 'vue';
import { productsRepository } from './repositories/ProductsRepository.mjs';
import { salesRepository } from './repositories/SalesRepository.mjs';

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

function getSales(){
  salesRepository.getSalesAPI()
  .then(res => {
    sales.value = res;
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
    getSales();
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
  // const newProduct = {...product}
  let newProduct = Object.assign({}, product)
  newProduct.quantity = document.getElementById(btnId).value;
  // console.log(product);
  productsCart.value.push(newProduct);
}

function handleDeleteProductCart(index){
  // let indexProduct = productsCart.value.indexOf(product);
  // productsCart.splice(indexProduct,1);
  // productsCart.value = productsCart.value.filter((prod) => prod.id !== product.id)
  productsCart.value.splice(index, 1)
}

function handleComprar(){
  for (let product of productsCart.value){
    let cantidadTotalProducto = productsCart.value.reduce((acum, curr) => {return parseInt(curr.quantity) + acum}, 0)
    if (cantidadTotalProducto > product.stock){
      alert ("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito");
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

// onMounted(getProducts);
function init(){
  getProducts();
  getSales();
};
onMounted(init);

</script>

<template>
  <!-- <CustomHeader/> -->
  <header>
    <h1 class="bg-green-500 font-bold mx-auto rounded-lg shadow-lg shadow-gray-600 text-xl p-4">PRODUCT API REST</h1>
  </header>
  <nav>
    <ul>
      <li><a href="http://localhost:3000/products/">Productos</a></li>
      <li><a href="http://localhost:3000/products/sales">Ventas</a></li>
    </ul>
  </nav>
  <section>
    <!-- <div>{{message}}</div> -->
    <div class="mx-auto">
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
              <GenericButton @click="handleModify(product)" class="btnModificar">Modificar</GenericButton>
              <GenericButton @click="handleDelete(product.id)" class="btnBorrar">Borrar</GenericButton>
            </td>
            <td><input type="number" name="cantidadAnadir" :id="'cantidadAnadir-'+product.id" min="1" :max="product.stock" value="1"><GenericButton @click="handleAddProduct(product)">Añadir</GenericButton></td>
          </tr> 
        </tbody>
      </table>
    </div>

    <br>

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
              <GenericButton @click="handleDeleteProductCart(index)" class="btnBorrar">Borrar</GenericButton>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr><td colspan="5" style="text-align: center;"><GenericButton @click="handleComprar">Comprar</GenericButton></td></tr>
          <!-- <tr><td colspan="5" style="text-align: center;" ><button @click="handleComprar">Comprar</button></td></tr> -->
        </tfoot>
      </table>
    </div>
    <hr>
    <br>
    <!-- <form action="http://localhost:3000/products" method="post"> -->
    <div>
      <form @submit="handleSubmit" id="formProducto" class="bg-orange-400">
        <h3>Modicar producto</h3>
        <input type="text" name="id" id="idProduct" style="display:none;">
        <label for="name" class="border border-solid border-black">Nombre</label><input type="text" name="name" id="newProductName" required><br>
        <label for="price">Precio</label><input type="number" name="price" id="newProductPrice" required><br>
        <label for="stock">Stock</label><input type="number" name="stock" id="newProductStock" required><br>
        <label for="categoria">Categoria</label><textarea name="category" id="newProductCategory" required></textarea><br>
        <input type="submit" value="Añadir producto" class="border border-solid border-black p-1 rounded-md">
      </form>
    </div>
    <hr>
    <br>
    <table v-if="sales.length != 0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Fecha venta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="venta in sales">
            <td>{{venta.name}}</td>
            <td>{{venta.price}}</td>
            <td>{{venta.quantity}}</td>
            <td>{{venta.total}}</td>
            <td>{{venta.sale_date}}</td>
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
