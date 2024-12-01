<template>
  <div id="fondo-welcome" class="min-h-screen flex flex-col justify-center items-center bg-cover bg-center">
    <!-- Contenedor central -->
    <div class="text-center text-black bg-white px-6 py-12 bg-opacity-80 w-full md:w-2/3 lg:w-1/2 rounded-lg">
      <h1 class="text-4xl font-bold mb-4">Bienvenido a Bazar Online</h1>
      <p class="text-lg font-semibold mb-6">
        Bazar Online es una plataforma de comercio electrónico que ofrece una amplia variedad de productos accesibles para todos. 
        Compra de manera fácil y rápida desde la comodidad de tu hogar.
      </p>
      <!-- Botón de login -->
      <router-link to="/login">
        <button class="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl shadow-md hover:bg-blue-600 transition-colors">
          Iniciar sesión
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
};
</script>

<style scoped>
#fondo-welcome{
  background-image: url(../images/StockCake-Automated-Warehouse-Navigation_1731690260.jpg);
}
body{
  color: green !important;
}
</style>