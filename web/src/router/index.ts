import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WarView from '../views/WarView.vue'
import BattleView from '../views/BattleView.vue'
import CommanderView from '../views/CommanderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: HomeView },
    { path: '/war', name: "War", component: WarView },
    { path: '/battle', name: "Battle", component: BattleView },
    { path: '/commander', name: "Commander", component: CommanderView }
  ]
})

export default router
