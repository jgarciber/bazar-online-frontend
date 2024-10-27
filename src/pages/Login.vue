<script setup>

</script>

<template>
    <div class="flex flex-column justify-content-center align-items-center">
        <!-- <img src="./imagenes/logo-ies2-edit5.png" alt="Imagen_bienvenida_extranet" id="imagen_portada"><br> -->
        <h3>Iniciar sesión</h3>
        <form action="http://localhost:3000/login/" method="get">
          <label for="usuario">Usuario: </label><br>
          <input type="text" name="usuario" /><br>
          <label for="contrasena">Contraseña: </label><br>
          <input type="password" name="contrasena" /><br><br>
          <input type="submit" name="enviar" value="Entrar" class="btn btn-primary" />
        </form>
    </div>
</template>