<script setup lang="ts">
import TopBar from '../components/TopBar.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const warTag = ref(route.params.warTag)
const battleList = ref([])

async function getWarInfo(warTag: any) {
  console.log(warTag)
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
            PREFIX georss: <http://www.georss.org/georss/>
            PREFIX : <http://127.0.0.1:3030/>

            SELECT DISTINCT ?warName ?battle ?name ?beginDate ?coord
            WHERE {
                ?battle a :Battle .
                ?battle :hasName ?name .
                ?battle :isPartOf :${warTag} .
                :${warTag} :hasName ?warName .
                ?battle :begins ?beginDate .
                ?battle :hasEndpoint ?endpoint .
                
                SERVICE <https://dbpedia.org/sparql> {
                    ?endpoint georss:point ?coord .
                }
            }
            ORDER BY ?beginDate
            `,
        limit: 'none',
        infer: 'true',
      }),
    })

    const data = await response.json();

    battleList.value = data.results.bindings.map(item => ({
      warName: item.warName.value,
      battle: item.battle.value,
      name: item.name.value,
      beginDate: item.beginDate.value,
      coord: item.coord.value,
    }));

  } catch (error) {
    console.error('Error:', error);
  }
}


onMounted(() => {
  getWarInfo(warTag.value)
})

</script>

<template>
  <main>
    <TopBar />
    <h1>{{ battleList[0]["warName"] }}</h1>
    {{ battleList }}
  </main>
</template>