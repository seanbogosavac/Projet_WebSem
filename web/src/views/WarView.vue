<script lang="ts" src="./WarView.ts"/>

<template>
  <main>
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <div v-if="isReady">
      {{ battleList }}
      <svg id="map" width="960" height="500"></svg>
    </div>
  </main>
</template>