<script setup lang="ts">
import TopBar from '../components/TopBar.vue'
import { ref } from 'vue'; // Import ref for reactive variables

const warList = ref([]);

async function getAllWars() {
  try {
    const response = await fetch('http://localhost:3030/Battles/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryLn: 'SPARQL',
        query: `
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX : <http://127.0.0.1:3030/>
          
          SELECT DISTINCT ?war ?name
          WHERE {
            ?war a :War .
            ?war :hasName ?name .
          }
        `,
        limit: 'none',
        infer: 'true',
      }),
    });

    const data = await response.json();

    warList.value = data.results.bindings.map(item => ({
      name: item.name.value,
      uri: item.war.value,
    }));

  } catch (error) {
    console.error('Error:', error);
  }
}

</script>

<template>
  <main>
    <TopBar />
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <button @click="getAllWars">Run Query</button>
    <ul>
      <li v-for="war in warList" :key="war.uri">
        <button @click="navigateToWar(war.uri)">{{ war.name }}</button>
      </li>
    </ul>
  </main>
</template>