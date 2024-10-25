<!-- <script setup>
defineProps(['product'])

</script> -->

<template>
    <!-- <article class="flex flex-col p-4 border border-orange-400 rounded-2xl items-center justify-center transition-colors hover:bg-orange-500 cursor-pointer">
        <h5 class="text-md uppercase text-center">{{ product.name }}</h5>
        <span class="text-md">({{ Number(product.price).toFixed(2) }})</span>
    </article> -->
    <button class="border border-solid border-black p-1 rounded-md" >
        <slot/>
    </button>
</template>