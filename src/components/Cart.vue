<script setup>
import GenericBlueButton from './GenericBlueButton.vue';
import GenericGreenButton from './GenericGreenButton.vue';
import GenericRedButton from './GenericRedButton.vue';
import { productsRepository } from '@/repositories/ProductsRepository.mjs';
import { mostrarMensajeEnCursor } from '@/functions.mjs';
import PlusSimbol from '@/icons/PlusSimbol.vue';
import MinusSimbol from '@/icons/MinusSimbol.vue';

import { ref, watch, computed, onMounted } from 'vue';

 // Estado reactivo del carrito
const productsCartNav = ref([]);

// Descuento e impuestos
const descuento = ref(parseFloat(import.meta.env.VITE_DISCOUNT));
const impuesto = ref(parseFloat(import.meta.env.VITE_IVA));  

// Función para cargar el carrito desde sessionStorage
const loadCartFromSession = () => {
    let userIdCart = 'cart-' + sessionStorage.getItem('user_id')
    const savedCart = sessionStorage.getItem(userIdCart);
    if (savedCart) {
        productsCartNav.value = JSON.parse(savedCart);
    }
};

// Guardar en sessionStorage cada vez que el carrito cambie
const saveCartToSession = () => {
    let userIdCart = 'cart-' + sessionStorage.getItem('user_id')
    sessionStorage.setItem(userIdCart, JSON.stringify(productsCartNav.value));
};

watch(
  productsCartNav, // Observa los cambios en productsCartNav
  (newCart, oldCart) => {
    // Llamar a saveCartToSession para guardar el carrito en sessionStorage
    saveCartToSession();

    // Llamar a handleUpdateCart para emitir el evento
    handleUpdateCart();
  },
  { deep: true } // Esto asegura que se detecten los cambios dentro de los objetos en el carrito (si hay objetos complejos)
);

function handleUpdateCart() {
    // Emitir un evento personalizado para notificar sobre el cambio
    const event = new CustomEvent("cartUpdated", {
    detail: { message: "Carrito actualizado" },
    });
    window.dispatchEvent(event); // Emitir el evento globalmente en la ventana
}

onMounted(() => {
    loadCartFromSession()
});

function decreaseProduct(index){
    let product = productsCartNav.value[index]
    if(product.quantity > 1){
        product.quantity -= 1
    }else{
        mostrarMensajeEnCursor(`"${product.name}" retirado del carrito`);
        handleDeleteProductCart(index)
    }
}

function increaseProduct(index, newQuantity){
  let product = productsCartNav.value[index]
  if(product.quantity + newQuantity <= product.stock){
    product.quantity += newQuantity
  }else{
    mostrarMensajeEnCursor(`No puede añadir más "${product.name}", stock insuficiente`)
  }
}

function handleDeleteProductCart(index){
  mostrarMensajeEnCursor(`"${productsCartNav.value[index].name}" borrado del carrito`);
  productsCartNav.value.splice(index, 1)
}

async function handleComprar(){
  for (let product of productsCartNav.value){
    if (product.quantity > product.stock){
      alert ("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito para continuar");
      return;
    }
  }

  if (confirm('¿Quiere finalizar la comprar?')){
    try {
      // Llamada a la API de checkout
      const res = await productsRepository.checkoutAPI(productsCartNav.value);
      
      // Si la respuesta es exitosa (código 200)
      if (res.message) {
        alert(res.message); // Mostrar el mensaje de éxito
        // getProducts();
        productsCartNav.value = []; 
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
  return productsCartNav.value.reduce((total, product) => total + (product.price * product.quantity), 0);
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
  if(confirm("¿Quiere vaciar el carrito de la comprar?")) productsCartNav.value = [];
}
</script>

<template>
    <table v-if="productsCartNav.length != 0" class="mx-auto">
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
            <tr v-for="(product, index) in productsCartNav">
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
    <div v-else>
        <p>Carrito vacío</p>
    </div>
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
table td{
  padding: 5px;
}
table, table td, table th{
  border: solid;
}
</style>