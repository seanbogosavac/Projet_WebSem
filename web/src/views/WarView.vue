<script lang="ts" src="./WarView.ts"/>

<template>
  <main>
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <div v-if="isReady">
      {{ battleList }}
    </div>
  </main>
</template>