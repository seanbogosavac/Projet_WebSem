import { defineComponent } from 'vue'

export default defineComponent({
    name: 'CommanderView',
    data() {
        return {
            commanderTag: "",
            commanderInfo: null as null | any,
            battlesInfo: null as null | any
        }
    },
    computed: {
        isReady() { return !!this.commanderInfo }
    },
    components: {
    },
    async mounted() {
        const id = this.$route.params.commanderTag

        if (!id || typeof id !== "string") this.$router.push("/")
        this.commanderTag = id as string

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
                                
                    SELECT DISTINCT ?name ?abstract ?battleName ?belName ?side ?battle
                    WHERE {
                        :${this.commanderTag} a :Commander .
                        :${this.commanderTag} :hasEndpoint ?name .
                    
                        :${this.commanderTag} :foughtFor ?side .
                        ?belligerant :wasIn ?side .
                        ?belligerant :hasName ?belName .
                        ?side :foughtIn ?battle .
                        ?battle :hasName ?battleName .
                    }
                `,
                limit: 'none',
                infer: 'true',
            }),
        })

        const data = await response.json() as graphResponse

        this.commanderInfo = {
            name: decodeURI(data.results.bindings[0].name.value.replace("http://dbpedia.org/resource/", '')).replace(/_/g, ' '),
            //abstract: data.results.bindings[0].abstract.value
        }
      
        this.battlesInfo = data.results.bindings.map(item => ({
            id: item.battle.value.replace("http://127.0.0.1:3030/", ''),
            name: item.battleName.value,
            belName: item.belName.value
        }))

        console.log(this.battlesInfo)

    }
})