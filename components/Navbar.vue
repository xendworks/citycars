<template>
     <!-- Top Bar -->
     <div class="bg-gray-800 font-lexend text-white py-1 px-4 text-right">
      <div class="container mx-auto">
        <span class="mr-4 font-inter">+44 1293344804</span>
        <span class="font-inter">|</span>
        <span class="ml-4 font-inter">bookings@citycars.co.uk</span>
      </div>
    </div>

    <!-- Navigation -->
    <header class="bg-white shadow sticky top-0 w-full z-10 font-lexend">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/">
          <div class="text-3xl font-bold font-lexend">
            <span class="text-black">CITY</span>
            <span class="text-amber-400">CARS</span>
          </div>
         </NuxtLink>
        </div>
        <nav class="hidden md:flex space-x-8 font-lexend">
          <a href="/airport-taxis" class="text-gray-700 hover:text-amber-500">Airport Taxis</a>
          <a href="/wheel-chair-taxis" class="text-gray-700 hover:text-amber-500">Wheel Chair Taxis</a>
          <a href="#" class="text-gray-700 hover:text-amber-500">Areas we cover</a>
          <a href="/contact-us" class="text-gray-700 hover:text-amber-500">Contact us</a>
        </nav>
        <button class="bg-amber-400 hover:bg-amber-500 text-white py-2 px-6 rounded-md font-semibold font-lexend">
          SIGNUP NOW
        </button>
      </div>
    </header>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
nav {
  a {
    @apply hover:text-amber-500 font-lexend transition-colors;
  }

}


.font-lexend {
  font-family: "Lexend", sans-serif !important;
}

.font-inter {
  font-family: "Inter", sans-serif !important;
}
</style>
