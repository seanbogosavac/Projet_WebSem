<template>
  <div class="top-bar">
    <router-link to="/">
      <div class="logo">BattlePedia</div>
    </router-link>
    <router-link to="/battle">Battle</router-link>
    <router-link to="/commander">Commander</router-link>
    <div class="search-bar">
      <input type="text" placeholder="Search...">
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TopBar'
}
</script>

<style scoped>
.top-bar {
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo, .logo:hover, .logo:active  {
  font-size: 30px;
  text-decoration: none;
  color: white;
}

.search-bar input {
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid white;
  background-color: transparent;
  color: white;
}</style>