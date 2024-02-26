<template>
  <div class="top-bar">
    <router-link to="/">Home</router-link>
    <router-link to="/war">War</router-link>
    <router-link to="/battle">Battle</router-link>
    <router-link to="/commander">Commander</router-link>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
};
</script>

<style scoped>
.top-bar {
  background-color: #333;
  padding: 10px;
  color: white;
}
</style>
