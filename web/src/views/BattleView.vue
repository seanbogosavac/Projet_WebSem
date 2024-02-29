<script lang="ts" src="./BattleView.ts"/>

<template>
  <main>
    <div v-if="isReady">
      <h1>BATTLE OF {{ battleInfo.name }}</h1>
      {{ battleInfo.abstract }}
    </div>
    <svg id="map" width="960" height="500"></svg>
    <div v-if="isReady">
    Belligerants :<br/>
    Attackers :
    <li v-for="att in attackersInfo" :key="att.id">
        {{ att.belName }}
        <router-link :to="`/commander/${att.id}`">
          <button>{{ att.comName }}</button>
        </router-link>
    </li>
    Defenders :
    <li v-for="def in defendersInfo" :key="def.id">
        {{ def.belName }}
        <router-link :to="`/commander/${def.id}`">
          <button>{{ def.comName }}</button>
        </router-link>
    </li>
    Result : {{ this.result }}
    </div>
  </main>
</template>