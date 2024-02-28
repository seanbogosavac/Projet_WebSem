import { defineComponent } from 'vue'
import * as d3 from 'd3'

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
            long: parseFloat(item.coord.value.split(' ')[0]),
            lat: parseFloat(item.coord.value.split(' ')[1])
        }));

        console.log(this.battleList)

        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        const projection = d3.geoNaturalEarth1()
            .scale(width / 1.3 / Math.PI)
            .translate([width / 2, height / 2])

        const data2 = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")

        const points = this.battleList.map(item => ({
            "type": "Feature",
            "properties": { "name": item.name },
            "geometry": {
                "type": "Point",
                "coordinates": [item.lat, item.long]
            }
        }))

        console.log(points)

        svg.append("g")
            .selectAll("path")
            .data(data2.features)
            .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")

        svg.append("g")
            .selectAll("path")
            .data(points)
            .enter().append("path")
            .attr("fill", "#FF0000")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")

    }
})