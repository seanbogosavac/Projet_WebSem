<script lang="ts" src="./WarView.ts"/>

<template>
  <main>
    <div v-if="isReady">
      <h1>{{ battleList[0].warName }}</h1>
    </div>
    <svg id="map" width="960" height="500"></svg>
    <ul v-if="isReady">
      <li v-for="battle in battleList" :key="battle.id">
        <router-link :to="`/battle/${battle.id}`">
          <button>{{ battle.beginDate }} - BATTLE OF {{ battle.name }}</button>
        </router-link>
      </li>
    </ul>
  </main>
</template>