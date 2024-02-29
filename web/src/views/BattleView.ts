import { defineComponent } from 'vue'
import * as d3 from 'd3'

export default defineComponent({
  name: 'BattleView',
  data() {
    return {
      battleId: "",
      battleInfo: null as null | any,
      sidesInfo: null as null | any,
      attackersInfo: null as null | any,
      defendersInfo: null as null | any,
      result: "" as string
    }
  },
  computed: {
    isReady() { return !!this.battleInfo }
  },
  components: {
  },
  async mounted() {
    const id = this.$route.params.battleId

    if (!id || typeof id !== "string") this.$router.push("/")
    this.battleId = id as string

    const response = await fetch('http://localhost:3030/Battles/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        queryLn: 'SPARQL',
        query: `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dbo: <http://dbpedia.org/ontology/>
            PREFIX georss: <http://www.georss.org/georss/>
            PREFIX : <http://127.0.0.1:3030/>
            
            SELECT DISTINCT ?name ?coord ?abstract ?result ?belName ?commander ?comName ?isAttacker
            WHERE {
              :${this.battleId} :hasName ?name .
                :${this.battleId} :hasEndpoint ?endpoint .
                :${this.battleId} :resultedIn ?result .
              
                ?side :foughtIn :${this.battleId} .
                ?side :isAttacker ?isAttacker .
              
                ?belligerant :wasIn ?side .
                ?belligerant :hasName ?belName .
              
                ?commander :foughtFor ?side .
                ?commander :hasName ?comName .
            
                SERVICE <https://dbpedia.org/sparql> {
                ?endpoint georss:point ?coord .
                ?endpoint dbo:abstract ?abstract .
                FILTER(LANG(?abstract) = "en")
              }
            }
            `,
        limit: 'none',
        infer: 'true',
      }),
    })

    const data = await response.json() as graphResponse

    this.battleInfo = {
      name: data.results.bindings[0].name.value,
      abstract: data.results.bindings[0].abstract.value,
      result: data.results.bindings[0].result.value,
      long: parseFloat(data.results.bindings[0].coord.value.split(' ')[0]),
      lat: parseFloat(data.results.bindings[0].coord.value.split(' ')[1])
    }

    this.sidesInfo = data.results.bindings.map(item => ({
      id: item.commander.value.replace("http://127.0.0.1:3030/", ''),
      belName: item.belName.value,
      comName: item.comName.value,
      isAttacker: item.isAttacker.value
    }))

    this.attackersInfo = [];
    this.defendersInfo = [];

    this.sidesInfo.forEach(side => {
      console.log(side.isAttacker)
      if (side.isAttacker == "1") {
        this.attackersInfo.push(side)
      } else if (side.isAttacker == "0") {
        this.defendersInfo.push(side)
      }
    })

    this.result += this.attackersInfo[0].belName
    if (this.attackersInfo.length > 0) {
      for (let i = 1; i < this.attackersInfo.length; i++) this.result += " & " + this.attackersInfo[i].belName
    }

    switch (this.battleInfo.result) {
      case "-1":
        this.result += " defeated"
        break;

      case "1":
        this.result += " won"
        break;

      case "0":
        this.result = "Tie"
        break;

      default:
        this.result = "Unknown"
        break;
    }

    console.log(this.battleInfo)

    const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

    const projection = d3.geoNaturalEarth1()
      .scale(width / 1.3 / Math.PI)
      .translate([width / 2, height / 2])

    const data2 = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")

    const points = [{
      "type": "Feature",
      "properties": { "name": this.battleInfo.name },
      "geometry": {
        "type": "Point",
        "coordinates": [this.battleInfo.lat, this.battleInfo.long]
      }
    }]

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