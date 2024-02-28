import { defineComponent } from 'vue'

type warList = Array<{
    id: string,
    name: string,
    uri: string
}>

export default defineComponent({
    name: 'HomeView',
    data() {
        return {
            warList: null as warList | null
        }
    },
    computed: {
        isReady() { return !!this.warList }
    },
    components: {
    },
    async mounted() {
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

        const data = await response.json() as graphResponse;

        this.warList = data.results.bindings.map(item => ({
            id: item.war.value.replace("http://127.0.0.1:3030/", ''),
            name: item.name.value,
            uri: item.war.value,
        }));
    }
})
