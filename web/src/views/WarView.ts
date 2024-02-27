import { defineComponent } from 'vue'

export default defineComponent({
    name: 'WarView',
    data() {
        return {
            warTag: "",
            battleList: null as null | any
        }
    },
    computed: {
        isReady() { return !!this.battleList }
    },
    components: {
    },
    async mounted() {
        const tag = this.$route.params.warTag

        if (!tag || typeof tag !== "string") this.$router.push("/")
        this.warTag = tag as string

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
                ?battle :isPartOf :${this.warTag} .
                :${this.warTag} :hasName ?warName .
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

        const data = await response.json() as graphResponse;

        this.battleList = data.results.bindings.map(item => ({
            warName: item.warName.value,
            battle: item.battle.value,
            name: item.name.value,
            beginDate: item.beginDate.value,
            coord: item.coord.value,
        }));
    }
})