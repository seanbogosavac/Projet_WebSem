<script lang="ts" src="./WarView.ts"/>

<template>
  <main>
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <div v-if="isReady">
      <h1>{{ battleList[0].warName }}</h1>
    </div>
    <svg id="map" width="960" height="500"></svg>
  </main>
</template>