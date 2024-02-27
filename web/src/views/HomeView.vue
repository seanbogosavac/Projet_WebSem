<script setup lang="ts">
import TopBar from '../components/TopBar.vue'
import { ref, onMounted } from 'vue'

const warList = ref([])

async function getAllWars() {
  try {
    const response = await fetch('http://localhost:3030/Battles/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
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
      id: item.war.value.replace("http://127.0.0.1:3030/", ''),
      name: item.name.value,
      uri: item.war.value,
    }));

  } catch (error) {
    console.error('Error:', error);
  }
}

onMounted(getAllWars); // Fetch data on component mount

</script>

<template>
  <main>
    <TopBar />
    <h1>Welcome to BattlePedia</h1>
    Select a war to learn more !

    <ul>
      <li v-for="war in warList" :key="war.id">
        <router-link :to="`war/${war.id}`">
          <button>{{ war.name }}</button>
        </router-link>
      </li>
    </ul>
  </main>
</template>