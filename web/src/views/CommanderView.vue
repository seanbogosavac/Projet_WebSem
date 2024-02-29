<script lang="ts" src="./CommanderView.ts"/>

<template>
  <main>
    <div v-if="isReady">
      <h1>{{ commanderInfo.name.toUpperCase() }}</h1>
    </div>
    <div v-if="isReady">
      Battles {{ commanderInfo.name }} took part in :
      <li v-for="battle in battlesInfo" :key="battle.id">
        Fought for {{ battle.belName }} in the battle of 
        <router-link :to="`/battle/${battle.id}`">
          <button>{{ battle.name }}</button>
        </router-link>
      </li>
    </div>
  </main>
</template>