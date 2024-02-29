import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WarView from '../views/WarView.vue'
import BattleView from '../views/BattleView.vue'
import CommanderView from '../views/CommanderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: "Home", component: HomeView },
    { path: '/war/:warTag', name: "War", component: WarView, props: true },
    { path: '/battle/:battleId', name: "Battle", component: BattleView, props: true },
    { path: '/commander/:commanderTag', name: "Commander", component: CommanderView, props: true }
  ]
})

export default router
