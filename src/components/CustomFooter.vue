<script setup>
</script>

<template>
  <footer class="bg-gray-800 text-white py-8 mt-8">
    <div class="container mx-auto px-4 text-center">
      <!-- Información personal y copyright -->
      <p class="text-lg mb-4">© 2024 <span class="font-semibold">Jesús Garcimartín Berbel</span>. Todos los derechos reservados.</p>
      
      <!-- Enlaces o información adicional -->
      <div class="flex justify-center content-center gap-6 mb-6">
        <a href="#" class="hover:underline">Política de privacidad</a>
        <a href="#" class="hover:underline">Términos de servicio</a>
        <a href="#" class="hover:underline">Contacto</a>
      </div>
      
      <!-- Redes sociales -->
      <div class="flex justify-center gap-6">
        <!-- Facebook -->
        <a href="https://facebook.com" class="social-icon facebook">
          <!-- SVG de Facebook -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-6 h-6">
            <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/>
          </svg>
        </a>

        <!-- Twitter -->
        <a href="https://twitter.com" class="social-icon twitter">
          <!-- SVG de Twitter -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-6 h-6">
            <path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"/>
          </svg>
        </a>

        <!-- LinkedIn -->
        <a href="https://linkedin.com" class="social-icon linkedin">
          <!-- SVG de LinkedIn -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="w-6 h-6">
            <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Estilos generales para los íconos */
.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1);
}

/* Colores específicos para cada red social */
.facebook {
  background-color: #3b5998; /* Color original de Facebook */
}

.twitter {
  background-color: #1da1f2; /* Color original de Twitter (ahora X) */
}

.linkedin {
  background-color: #0077b5; /* Color original de LinkedIn */
}
</style>
