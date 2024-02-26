import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import War from '../views/War.vue';
import Battle from '../views/Battle.vue';
import Commander from '../views/Commander.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/war', component: War },
  { path: '/battle', component: Battle },
  { path: '/commander', component: Commander }
];

const router = new VueRouter({
  routes
});

export default router;
