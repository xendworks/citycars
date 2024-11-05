<template>
  <footer class="footer">
    <div class="footer-left">
      <img src="@/assets/images/logo.svg" alt="Logo" class="footer-logo" />
    </div>
    <div class="footer-right">
      <div class="footer-contact">
        <p><a href="mailto:citycarsgatwick@gmail.com">citycarsgatwick@gmail.com</a></p>
        <p><a href="tel:+1234567890">+123 456 7890</a></p>
        <p>Copyrights 2024. City Cars Gatwick Ltd.</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// Footer component logic here if needed
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom:0;
  width:100%;
  padding: 20px;
}

.footer-left {
  flex: 1;
}

.footer-logo {
  width: 120px; /* Adjust logo size */
}

.footer-right {
  display: flex;
  flex-wrap: wrap;
  text-align: right;
}

.footer-contact{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-contact p {
  margin: 0;
  margin-left:20px;
}

.footer-contact a {
  text-decoration: none;
}

.footer-contact a:hover {
  text-decoration: underline;
}
</style>
