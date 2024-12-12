// ESTE ARCHIVO NO ESTÁ SIENDO UTILIZADO EN EL PROYECTO, PARA ACTUALIZAR EL CARRITO SE HA RECURRIDO A UNA ACTUALIZACIÓN MÁS MANUAL
// stores/cartStore.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // Lista de productos en el carrito
  }),
  getters: {
    // Cálculos computados del carrito
    subtotal: (state) => {
      return state.items.reduce((total, product) => total + (product.price * product.quantity), 0);
    },
    descuentoTotal: (state) => {
      // Aquí puedes aplicar cualquier lógica de descuento que tengas
      return state.subtotal * 0.1; // Ejemplo: 10% de descuento
    },
    subtotalConDescuento: (state) => {
      return state.subtotal - state.descuentoTotal;
    },
    impuestos: (state) => {
      return state.subtotalConDescuento * 0.2; // Ejemplo: 20% de impuestos
    },
    totalFinal: (state) => {
      return state.subtotalConDescuento + state.impuestos;
    },
  },
  actions: {
    // Añadir un producto al carrito
    addToCart(product, quantity) {
      if (product.stock <= 0) {
        this.showMessage(`El producto "${product.name}" está agotado y no se puede añadir al carrito.`);
        return;
      }
      if (quantity <= 0 || quantity > product.stock) {
        this.showMessage(`No puede añadir ${quantity} unidades del producto "${product.name}", stock insuficiente.`);
        return;
      }

      const existingProductIndex = this.items.findIndex(item => item.id === product.id);
      if (existingProductIndex !== -1) {
        this.increaseProduct(existingProductIndex, quantity);
      } else {
        this.items.push({ ...product, quantity });
        this.showMessage(`"${product.name}" añadido al carrito.`);
      }
    },
    
    // Aumentar la cantidad de un producto en el carrito
    increaseProduct(index, quantity) {
      const product = this.items[index];
      if (product.quantity + quantity <= product.stock) {
        product.quantity += quantity;
      } else {
        this.showMessage(`No puede añadir más "${product.name}", stock insuficiente.`);
      }
    },
    
    // Disminuir la cantidad de un producto en el carrito
    decreaseProduct(index) {
      const product = this.items[index];
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        this.deleteProduct(index);
      }
    },

    // Eliminar un producto del carrito
    deleteProduct(index) {
      const productName = this.items[index].name;
      this.items.splice(index, 1);
      this.showMessage(`"${productName}" borrado del carrito.`);
    },

    // Vaciar el carrito
    clearCart() {
      this.items = [];
    },

    // Mostrar mensajes (esto puede ser un método más genérico para manejar alertas)
    showMessage(message) {
      console.log(message); // Aquí puedes usar algo como un `toastr` o mostrarlo en la UI
      alert(message);
    },

    // Procesar la compra
    async handleComprar() {
      for (let product of this.items) {
        if (product.quantity > product.stock) {
          this.showMessage("Tiene más productos en el carrito que disponibles en stock. Por favor borre algunos artículos del carrito para continuar.");
          return;
        }
      }
      
      if (confirm('¿Quiere finalizar la compra?')) {
        try {
          // Llamada a la API de checkout
          const res = await productsRepository.checkoutAPI(this.items);
          
          if (res.message) {
            this.showMessage(res.message);
            this.clearCart();
          }

          if (res.errors && res.errors.length > 0) {
            const allErrors = res.errors.map(error => error.message).join('\n');
            this.showMessage(allErrors);
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            console.log('Error del servidor:', error.response.data.error);
            this.showMessage('Hubo un error al procesar la compra: ' + error.response.data.error);
          } else if (error.response && error.response.status === 403) {
            this.showMessage('Control de acceso: no tienes permisos para realizar esta compra');
          } else {
            console.log('Error general:', error);
            this.showMessage('Hubo un error al procesar la compra. Por favor, inténtelo de nuevo.');
          }
        }
      }
    },
  }
});
