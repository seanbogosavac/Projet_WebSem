function getAllWars() {
    $.ajax({
        url: 'http://localhost:3030/Battles/query',
        dataType: 'json',
        data: {
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
            Accept: 'application/sparql-results+json'
        },
        success: function (data) {
            var namesList = $('#warList');
            namesList.empty();

            data.results.bindings.forEach(function (item) {
                var name = item.name.value;
                var uri = item.war.value
                var button = $('<button>').text(name).click(function () {
                    getWarInfo(uri);
                });
                namesList.append($('<li>').append(button));
            });
        },
        error: function (errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}


function getWarInfo(war) {
    var namesList = $('#warList');
    namesList.empty();

    console.log(war);

    $.ajax({
        url: 'http://localhost:3030/Battles/query',
        dataType: 'json',
        data: {
            queryLn: 'SPARQL',
            query: `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX georss: <http://www.georss.org/georss/>
            PREFIX : <http://127.0.0.1:3030/>

            SELECT DISTINCT ?battle ?name ?beginDate ?coord
            WHERE {
                ?battle a :Battle .
                ?battle :hasName ?name .
                ?battle :isPartOf :${war} .
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
            Accept: 'application/sparql-results+json'
        },
        success: function (data) {
            console.log(data)
        },
        error: function (errorThrown) {
            console.error('Error:', errorThrown);
        }
    });
}