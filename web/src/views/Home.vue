<template>
  <div>
    <TopBar />
    <h1>Welcome to the Home Page!</h1>
    <!-- Add Home-specific content here -->
  </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';

export default {
  name: 'Home',
  components: {
    TopBar,
  },
};
</script>

<style scoped>
/* Add Home-specific styles here */
</style>
