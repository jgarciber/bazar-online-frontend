<script setup>
import GenericGreenButton from '@/components/GenericGreenButton.vue';
import GenericBlueButton from '@/components/GenericBlueButton.vue';
import GenericRedButton from '@/components/GenericRedButton.vue';
import PlusSimbol from '@/icons/PlusSimbol.vue';
import MinusSimbol from '@/icons/MinusSimbol.vue';
import {ref, onMounted, nextTick, watch, computed} from 'vue';
import { productsRepository } from '../repositories/ProductsRepository.mjs';
import { categoriesRepository } from '@/repositories/CategoriesRepository.mjs';
import { getCookie, mostrarMensajeEnCursor, smoothScrollJS } from '@/functions.mjs';

//Variables que almacenan la información recibida del servidor
const products = ref([]);
const categories = ref([]);
const productsCart = ref([]);

const isEditingProduct = ref(false);
const isAdmin = ref();

//Variables reactivas con los campos del formulario
let newProductName = ref('');
let newProductPrice = ref('');
let newProductStock = ref('');
let newProductCategory = ref(0);
let searchKeyWord = ref();

// Descuento e impuestos
const descuento = ref(parseFloat(import.meta.env.VITE_DISCOUNT));
const impuesto = ref(parseFloat(import.meta.env.VITE_IVA));  

// Variable para controlar el estado de carga
const isLoading = ref(false); // El spinner será visible al inicio

// Cargar el carrito desde sessionStorage cuando el componente se monta
const loadCartFromSession = () => {
  let userIdCart = 'cart-' + sessionStorage.getItem('user_id')
  const savedCart = sessionStorage.getItem(userIdCart);
  if (savedCart) {
    productsCart.value = JSON.parse(savedCart);
  }
};

// Guardar en sessionStorage cada vez que el carrito cambie
const saveCartToSession = () => {
  let userIdCart = 'cart-' + sessionStorage.getItem('user_id')
  sessionStorage.setItem(userIdCart, JSON.stringify(productsCart.value));
};

// Uso de watch para sincronizar el carrito con sessionStorage
watch(productsCart, saveCartToSession, { deep: true });

const updateCartFromEvent = () => {
  // Recargar el carrito desde sessionStorage cuando el evento se dispara
  loadCartFromSession();
};

async function getProducts(){
  isLoading.value = true;
  productsRepository.getProductsAPI()
  .then(res => {
    products.value = res;
  }).catch(error => {
    console.error("Error al obtener los productos:", error);
  })
  .finally(() => {
    isLoading.value = false; // Desactivar el spinner
  });
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
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getProducts();
      isEditingProduct.value = false;
      cancelarFormularioProducto();
    }
  })
}

function putProduct(modifiedProduct){
  productsRepository.putProductAPI(modifiedProduct)
  .then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getProducts();
      isEditingProduct.value = false;
      cancelarFormularioProducto();
    }
  })
} 

function deleteProducts(id){
  productsRepository.deleteProductAPI(id)
  .then(res => {
    if (res.message) alert(res.message);
    if (res.errors && res.errors.length > 0) {
      // Concatenamos todos los mensajes de error en una sola cadena
      const allErrors = res.errors.map(error => error.message).join('\n');
      alert(allErrors);  // Mostrar todos los errores en una sola ventana alert
    }else{
      getProducts();
    }
  })
}

function handleSubmit(e){
  e.preventDefault();
  const newProduct = Object.fromEntries(new FormData(e.target).entries());
  // Hay que añadir manualmente al objeto newProduct el valor del campo select category del formulario, ya que este no se incluye en el FormData (por no ser un campo de tipo input)
  let newProductCategory = document.getElementById('newProductCategory');
  newProduct.categoryId = newProductCategory.value;
  // newProduct.category = newProductCategory.options[newProductCategory.selectedIndex].text;
  isEditingProduct.value ? putProduct(newProduct) : postProduct(newProduct);
  e.target.reset();
  productsCart.value = [];
}

function handleModify(product){
  isEditingProduct.value = true;
  document.getElementById("idProduct").value = product.id;
  newProductName.value = product.name;
  newProductPrice.value = product.price;
  newProductStock.value = product.stock;
  newProductCategory.value = product.categoryId;
  smoothScrollJS('formProducto')
}

function handleDelete(product){
  if (confirm(`¿Está seguro que quiere borrar el producto "${product.name}"?`)) deleteProducts(product.id);
}

function handleAddProduct(product){
   // Comprobamos si el producto tiene stock disponible
   if (product.stock <= 0) {
    mostrarMensajeEnCursor(`El producto "${product.name}" está agotado y no se puede añadir al carrito.`);
    return;  // No continúa con la ejecución de la función si el stock es 0
  }

  let btnId = "cantidadAnadir-" + product.id
  // Copio el objeto
  let newProduct = Object.assign({}, product)
  newProduct.quantity = Number.parseFloat(document.getElementById(btnId).value);
  let indiceProductoExistenteCarrito = null;
  // productoExistenteCarrito = productsCart.value.find(p => p.id == product.id);
  indiceProductoExistenteCarrito = productsCart.value.findIndex(p => p.id == product.id);
  if (indiceProductoExistenteCarrito != -1) {
    // productoExistenteCarrito.quantity += newProduct.quantity;
    increaseProduct(indiceProductoExistenteCarrito, newProduct.quantity)
    mostrarMensajeEnCursor(`"${product.name}" x ${newProduct.quantity} unidades añadido al carrito`);
  }else if (Number.parseInt(newProduct.quantity) <= Number.parseInt(product.stock)){
    productsCart.value.push(newProduct);
    mostrarMensajeEnCursor(`"${product.name}" x ${newProduct.quantity} unidades añadido al carrito`);
  }else{
    mostrarMensajeEnCursor(`No puede añadir ${newProduct.quantity} unidades del producto '${product.name}' al carrito, stock insuficiente. Reduzca la cantidad hasta ${product.stock} unidades como máximo.`);
  }
}

function decreaseProduct(index){
  let product = productsCart.value[index]
  if(product.quantity > 1){
    product.quantity -= 1
  }else{
    mostrarMensajeEnCursor(`"${product.name}" retirado del carrito`);
    handleDeleteProductCart(index)
  }
}

function increaseProduct(index, newQuantity){
  let product = productsCart.value[index]
  if(product.quantity + newQuantity <= product.stock){
    product.quantity += newQuantity
  }else{
    mostrarMensajeEnCursor(`No puede añadir más "${product.name}", stock insuficiente`)
  }
}

function handleDeleteProductCart(index){
  mostrarMensajeEnCursor(`"${productsCart.value[index].name}" borrado del carrito`);
  productsCart.value.splice(index, 1)
}

async function handleComprar(){
  for (let product of productsCart.value){
    if (product.quantity > product.stock){
      alert ("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito para continuar");
      return;
    }
  }

  if (confirm('¿Quiere finalizar la comprar?')){
    try {
      // Llamada a la API de checkout
      const res = await productsRepository.checkoutAPI(productsCart.value);
      
      // Si la respuesta es exitosa (código 200)
      if (res.message) {
        alert(res.message); // Mostrar el mensaje de éxito
        getProducts();
        productsCart.value = []; 
      }

      // Si la respuesta contiene errores adicionales, los mostramos
      if (res.errors && res.errors.length > 0) {
        const allErrors = res.errors.map(error => error.message).join('\n');
        alert(allErrors);  // Mostrar todos los errores en una ventana alert
      }
    } catch (error) {
      // Manejo de errores cuando el código de estado es 400 o 500, o cualquier otro tipo de fallo     
      if (error.response && error.response.status === 400) {
        // Aquí puedes manejar errores con el código 400 (por ejemplo, error de validación)
        console.log('Error del servidor:', error.response.data.error);
        alert('Hubo un error al procesar la compra: ' + error.response.data.error);
      } else if (error.response && error.response.status === 403) {
        alert('Control de acceso: no tienes permisos para realizar esta compra')
      }else{
        // Si el error es diferente (por ejemplo, un error de red o un problema con la API)
        console.log('Error general:', error);
        alert('Hubo un error al procesar la compra. Por favor, inténtelo de nuevo.');
      }
    }
  }
}

// Cálculos computados
const subtotal = computed(() => {
  return productsCart.value.reduce((total, product) => total + (product.price * product.quantity), 0);
});

const descuentoTotal = computed(() => {
  return subtotal.value * descuento.value;
});

const subtotalConDescuento = computed(() => {
  return subtotal.value - descuentoTotal.value;
});

const impuestos = computed(() => {
  return subtotalConDescuento.value * impuesto.value;
});

const totalFinal = computed(() => {
  return subtotalConDescuento.value + impuestos.value;
});

function handleVaciarCarrito(){
  if(confirm("¿Quiere vaciar el carrito de la comprar?")) productsCart.value = [];
}

function cancelarFormularioProducto(){
  document.getElementById("idProduct").value = '';
  newProductName.value = '';
  newProductPrice.value = '';
  newProductStock.value = '';
  newProductCategory.value = 0;
  isEditingProduct.value = false;
}

function handleSearchProduct(e){
  e.preventDefault();
  productsRepository.searchProductsAPI(searchKeyWord.value)
    .then(res => {
      Array.from(document.getElementById("category-list").children).map(li => li.classList.remove("bg-blue-200"));
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

watch(searchKeyWord, (newValue) => {
  if (newValue.trim() === '') {
    getProducts();
  }
});

function init(){
  if(getCookie('token') == undefined){
    window.location.href = '/login';
  }else{
    loadCartFromSession();
    window.addEventListener("cartUpdated", updateCartFromEvent);
    getProducts();
    getCategories();
    isAdmin.value = sessionStorage.getItem('is_admin') == true ? true : false;
    // La función nextTick se ejecuta después de que el DOM ha sido completamente renderizado, lo que permite acceder a sus elementos, los cuales no estarían disponibles de otra manera. Esto es particularmente útil cuando se utilizan directivas como v-if, que muestran elementos condicionalmente según el valor de una variable.
    nextTick(() => {
      if (isAdmin.value){
        let formProducto = document.getElementById("formProducto");
      }
    });
  }
};
onMounted(init);

</script>

<template>
  <section class="mx-auto w-5/6">
    <div class="my-6">
      <form class="max-w-sm mx-auto" @submit="handleSearchProduct">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input type="search" id="default-search" v-model="searchKeyWord" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Productos..." required />
          <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
        </div>
      </form>
      <br>

      <div class="flex flex-row flex-wrap justify-center">
        <ul class="mx-3 mb-3" id="category-list">
          <h3 class="font-semibold">CATEGORÍAS:</h3>
          <li class="mx-2 hover:bg-blue-200 list-none hover:list-disc" @click="handleSearchCategory($event, 'todas')">TODAS</li>
          <li v-for="category in categories" @click="handleSearchCategory($event, category)" class="mx-2 hover:bg-blue-200 list-none hover:list-disc">{{ category.name }}</li>
        </ul>

        <div class="flex items-center overflow-x-auto">
          <div v-if="isLoading" class="spinner"></div>
          <div v-else-if="products.length != 0" class="relative sm:rounded-md shadow-[10px_10px_5px_rgba(0,0,0,0.5)]">
            <table class="w-full text-md text-center rtl:text-right text-gray-800 dark:text-gray-400">
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
                  <td class="whitespace-nowrap">{{product.price}} &euro;</td>
                  <td>{{product.stock}}</td>
                  <td>{{product.categoryName}}</td>
                  <td v-if="isAdmin">
                    <GenericBlueButton class="m-0.5" @click="handleModify(product)">Modificar</GenericBlueButton>
                    <GenericRedButton class="m-0.5" @click="handleDelete(product)">Borrar</GenericRedButton>
                  </td>
                  <td><input type="number" class="p-1 w-12 m-0.5" name="cantidadAnadir" :id="'cantidadAnadir-'+product.id" min="1" :max="product.stock" value="1"><GenericGreenButton class="m-0.5" @click="handleAddProduct(product)">Añadir</GenericGreenButton></td>
                </tr> 
              </tbody>
            </table>
          </div>
          <h3 v-else class="mx-auto my-auto">No hay ningún resultado</h3>
        </div>
      </div>
    </div>

    <div class="overflow-auto">
      <table v-if="productsCart.length != 0" class="mx-auto">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in productsCart">
            <td>{{product.name}}</td>
            <td><span class="flex justify-around content-center items-center !border-none"><MinusSimbol class="w-5 h-5 my-1 hover:cursor-pointer" @click="decreaseProduct(index, 1)"></MinusSimbol>{{product.quantity}}<PlusSimbol class="w-5 h-5 my-1 hover:cursor-pointer" @click="increaseProduct(index, 1)"></PlusSimbol></span></td>
            <td class="whitespace-nowrap">{{product.price}} &euro;</td>
            <td class="whitespace-nowrap">{{product.price * product.quantity}} &euro;</td>
            <td>
              <GenericRedButton @click="handleDeleteProductCart(index)">Borrar</GenericRedButton>
            </td>
          </tr>
          <!-- Subtotal -->
          <tr class="text-right">
            <td colspan="4">Subtotal: </td>
            <td class="whitespace-nowrap">{{ subtotal.toFixed(2) }} &euro;</td>
          </tr>
          <!-- Descuento -->
          <tr class="text-right">
            <td colspan="4"> {{ 'Descuento (' + descuento*100 + '%):' }} </td>
            <td class="whitespace-nowrap">{{ descuentoTotal.toFixed(2) }} &euro;</td>
          </tr>
          <!-- Subtotal con descuento -->
          <tr class="text-right">
            <td colspan="4">Subtotal con descuento: </td>
            <td class="whitespace-nowrap">{{ subtotalConDescuento.toFixed(2) }} &euro;</td>
          </tr>
          <!-- Impuestos -->
          <tr class="text-right">
            <td colspan="4">{{ 'Impuestos (' + impuesto*100 + '%):' }}</td>
            <td class="whitespace-nowrap">{{ impuestos.toFixed(2) }} &euro;</td>
          </tr>
          <!-- Total final -->
          <tr class="text-right font-bold uppercase">
            <td colspan="4" >Total: </td>
            <td class="whitespace-nowrap">{{ totalFinal.toFixed(2) }} &euro;</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="text-center">
                <GenericGreenButton @click="handleComprar">Comprar</GenericGreenButton>
                <GenericBlueButton @click="handleVaciarCarrito">Vaciar</GenericBlueButton>
            </td>
        </tr>
        </tfoot>
      </table>
    </div>
    <div class="my-6 overflow-auto" v-if="isAdmin">
      <form @submit="handleSubmit" id="formProducto" class="mx-auto max-w-xs sm:max-w-lg py-4 anadir-producto">
        <fieldset class="flex flex-col items-center gap-1 border-2 border-solid border-black p-3 rounded-lg bg-gradient-to-b from-orange-400 to-amber-300 shadow-[10px_10px_5px_rgba(0,0,0,0.5)]">
          <legend v-if="isEditingProduct == false" class="text-left text-lg font-semibold">Añadir producto</legend>
          <legend v-else class="text-lg font-semibold">Modificar producto</legend>
          <input type="text" name="id" id="idProduct" hidden>
          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="newProductName" class="border border-solid border-black">Nombre</label>
            <input v-model="newProductName" type="text" name="name" id="newProductName" required>
          </div>

          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="newProductPrice">Precio</label>
            <input v-model="newProductPrice" type="number" name="price" id="newProductPrice" min="0" step="0.01" required>
          </div>

          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="newProductStock">Stock</label>
            <input v-model="newProductStock" type="number" name="stock" id="newProductStock" min="1" required>
          </div>

          <div class="flex sm:flex-row flex-col flex-wrap gap-1">
            <label for="newProductCategory" class="text-left">Categoria</label>
            <select id="newProductCategory" style="width: 200px;" v-model="newProductCategory" required>
              <option value="0" selected disabled>--</option>
              <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
            </select>
          </div>

          <br>
          <input v-if="isEditingProduct == false" type="submit" value="Añadir producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <input v-else type="submit" value="Modificar producto" class="border border-solid border-black p-1 rounded-md hover:bg-green-400">
          <GenericRedButton v-if="newProductName != '' || newProductPrice != 0 || newProductStock != 0 || newProductCategory != 0" type="button" @click="cancelarFormularioProducto" id="btnCancelarFormProducto" class="p-1">Cancelar</GenericRedButton>
        </fieldset>
      </form>
    </div>
  </section>
</template>

<style scoped>
thead{
  border: solid;
  background-color: lightgreen;
}
th,td{
  padding: 6px;
}
table tr:hover{
  background-color: lightblue;
}
label{
  width: 100px;
  display: inline-block;
  background-color: rgb(253 230 138);
}
form.anadir-producto label, form.anadir-producto input, form.anadir-producto textarea, form.anadir-producto select{
  border: solid;
  border-width: 1px;
  width: 200px;
  /* width: 100%; Por defecto, ocupan el 100% del ancho disponible */
  /* max-width: 200px; El ancho máximo será 200px */
  /* min-width: 120px; El ancho mínimo será 120px */
  padding: 0;
  /* box-sizing: border-box; Asegura que el padding no afecte el tamaño total */
  /* transition: width 0.3s ease; Suaviza el cambio de tamaño */
}
table td{
  padding: 5px;
}
table, table td, table th{
  border: solid;
}
</style>
