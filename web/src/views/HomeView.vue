<script lang="ts" src="./HomeView.ts"/>

<template>
  <main>
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <ul v-if="isReady">
      <li v-for="war in warList" :key="war.id">
        <router-link :to="`war/${war.id}`">
          <button>{{ war.name }}</button>
        </router-link>
      </li>
    </ul>
  </main>
</template>