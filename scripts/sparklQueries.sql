// Fetch all wars
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX : <http://127.0.0.1:3030/>

SELECT DISTINCT ?war ?name
WHERE {
  ?war a :War .
  ?war :hasName ?name .
}


// Fetch all battles and their locations from selected war
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX georss: <http://www.georss.org/georss/>
PREFIX : <http://127.0.0.1:3030/>

SELECT DISTINCT ?battle ?name ?beginDate ?coord
WHERE {
  ?battle a :Battle .
  ?battle :hasName ?name .
  ?battle :isPartOf :{war} .
  ?battle :begins ?beginDate .
  ?battle :hasEndpoint ?endpoint .
  
  SERVICE <https://dbpedia.org/sparql> {
    ?endpoint georss:point ?coord .
  }
}
ORDER BY ?beginDate


// Fetch precise location of the battle from wikidata
PREFIX georss: <http://www.georss.org/georss/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX : <http://127.0.0.1:3030/>

SELECT DISTINCT ?Battle ?endpoint ?coord
WHERE {
  ?battle a :Battle .
  ?battle :hasName "WHITE MOUNTAIN" .
  ?battle :hasEndpoint ?endpoint
  
  SERVICE <https://dbpedia.org/sparql> {
    ?endpoint georss:point ?coord .
  }
}



// Fetch commander names
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX : <http://127.0.0.1:3030/>

SELECT DISTINCT ?commander ?endpoint ?name
WHERE {
  ?commander a :Commander .
  ?commander :hasName "PEMBERTON" .
  ?commander :hasEndpoint ?endpoint .
  
  SERVICE <https://dbpedia.org/sparql> {
    ?endpoint dbp:name ?name .
  }
}