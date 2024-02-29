import pandas as pd
import numpy as np

def cleanString(s):
    cleanStr = s.replace(" ", "_").replace("'", "").replace(",", "").replace("(", "").replace(")", "")
    return cleanStr

# Create output file and define name spaces
with open('../data/battles.ttl', 'w') as file:
    namespaces = [
        "@prefix : <http://127.0.0.1:3030/> .\n",
        "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n",
        "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n",
        "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\n\n"
    ]
    file.writelines(namespaces)

# Define types and relations
    types = [
        ":Battle a rdfs:Class .\n\n",
        ":Belligerant a rdfs:Class .\n\n",
        ":Commander a rdfs:Class .\n\n",
        ":Location a rdfs:Class .\n\n",
        ":War a rdfs:Class .\n\n",
        ":Side a rdfs:Class .\n\n\n"
    ]
    file.writelines(types)

    relations = [
        ":hasName a rdf:Property ;\n",
        "    rdfs:domain :Battle,\n",
        "        :Belligerant,\n",
        "        :Commander,\n",
        "        :Location,\n",
        "        :War ;\n",
        "    rdfs:range xsd:string .\n\n",

        ":hasEndpoint a rdf:Property ;\n",
        "    rdfs:domain :Battle,\n",
        "        :Commander ;\n",
        "    rdfs:range xsd:string .\n\n"

        ":isPartOf a rdf:Property ;\n",
        "    rdfs:domain :Battle ;\n",
        "    rdfs:range :War .\n\n",

        ":takesPlaceIn a rdf:Property ;\n",
        "    rdfs:domain :Battle ;\n",
        "    rdfs:range :Location .\n\n",

        ":resultedIn a rdf:Property ;\n",
        "    rdfs:domain :Battle ;\n",
        "    rdfs:range xsd:integer .\n\n",

        ":begins a rdf:Property ;\n",
        "    rdfs:domain :Battle ;\n",
        "    rdfs:range xsd:date .\n\n",

        ":ends a rdf:Property ;\n",
        "    rdfs:domain :Battle ;\n",
        "    rdfs:range xsd:date .\n\n",

        ":isAttacker a rdf:Property ;\n",
        "    rdfs:domain :Side ;\n",
        "    rdfs:range xsd:integer .\n\n",

        ":foughtIn a rdf:Property ;\n",
        "    rdfs:domain :Side ;\n",
        "    rdfs:range :Battle .\n\n",

        ":foughtFor a rdf:Property ;\n",
        "   rdfs:domain :Commander ;\n"
        "   rdfs:range :Side .\n\n",

        ":wasInSide a rdf:Property ;\n",
        "   rdfs:domain :Belligerant ;\n"
        "   rdfs:range :Side .\n\n\n"
    ]
    file.writelines(relations)


    # Preparing data extraction
    battleData = []
    warData = []
    locationData = []
    sideData = []
    belligerantData = []
    commanderData = []


    # Add main battle data
    battlesCsv = pd.read_csv("../data/battles.csv", sep=",", quotechar='"')
    for index, row in battlesCsv.iterrows():

        # Extract battle winners
        winVal = row['wina']
        winVal = -1 if np.isnan(winVal) else winVal

        # Extract battle data
        battleData.append([row['isqno'], row['name'], row['war'], row['locn'], winVal, str(row['dbpedia']).split(' ')[0]])

        # Extract war data
        war = [cleanString(row['war']), row['war']]
        if war not in warData:
            warData.append(war)

        # Extract location data
        location = [cleanString(row['locn']), row['locn']]
        if location not in locationData:
            locationData.append(location)


    # Add duration data
    durationsCsv = pd.read_csv("../data/battle_durations.csv", sep=",", quotechar='"')
    for index, row in durationsCsv.iterrows():
        dateMin, dateMax = str(row['datetime_min']), str(row['datetime_max'])
        dateMin = dateMin.split("T")[0] if dateMin != "nan" else "0000-00-00"
        dateMax = dateMax.split("T")[0] if dateMax != "nan" else "0000-00-00"

        battleData[row['isqno'] - 1].append(dateMin)
        battleData[row['isqno'] - 1].append(dateMax)


    # Add belligerant data
    actorsCsv = pd.read_csv("../data/battle_actors.csv", sep=",", quotechar='"')
    for index, row in actorsCsv.iterrows():
        # Side nodes
        sideId = str(row['isqno']) + "_" + cleanString(row['actor'])
        sideData.append([sideId, str(row['isqno']), row['attacker']])

        belligerant = [cleanString(row['actor']), row['actor'], [sideId]]

        # Checks if belligerant already exists, and if so adds the new sideId
        belToModify = next((i for i, bel in enumerate(belligerantData) if bel[0] == belligerant[0] and bel[1] == belligerant[1]), None)

        if belToModify is not None:
            belligerantData[belToModify][2].append(sideId)
        else:
            belligerantData.append(belligerant)


    # Add commanders data
    commandersCsv = pd.read_csv("../data/commanders.csv", sep=",", quotechar='"', encoding='latin1')
    for index, row in commandersCsv.iterrows():
        if row['commanders'] is None or row['commanders'] == "" or str(row['commanders']) == "nan": continue

        belligerants = [row['actors']] if " & " not in row['actors'] else row['actors'].split(" & ")
        sides = []
        for bel in belligerants: sides.append(str(row['isqno']) + "_" + cleanString(bel))

        uri = "<"
        if row['uri'] is None or row['uri'] == "" or str(row['uri']) == "nan" or row['uri'] == '?':
            uri += "nan>"
        else:
            uri += f"http://dbpedia.org/resource/{str(row['uri'])}>"

        commander = [cleanString(row['commanders']), row['commanders'], sides, uri]

        # Checks if commander already exists, and if so adds the new sideId
        comToModify = next((i for i, com in enumerate(commanderData) if com[0] == commander[0] and com[1] == commander[1]), None)

        if comToModify is not None:
            commanderData[comToModify][2].extend(sides)
        else:
            commanderData.append(commander)


    # Write final data to the file
    for battle in battleData:
        file.write(f":{battle[0]} a :Battle ;\n    :hasName \"{battle[1]}\" ;\n    :isPartOf :{cleanString(battle[2])} ;\n    :takesPlaceIn :{cleanString(battle[3])} ;\n    :begins \"{cleanString(battle[6])}\" ;\n    :ends \"{cleanString(battle[7])}\" ;\n    :resultedIn {int(battle[4])} ;\n    :hasEndpoint <{battle[5]}>.\n\n")
    file.write("\n")

    for war in warData:
        file.write(f":{war[0]} a :War ;\n    :hasName \"{war[1]}\" .\n\n")
    file.write("\n")

    for belligerant in belligerantData:
        file.write(f":{belligerant[0]} a :Belligerant ;\n    :hasName \"{belligerant[1]}\" ;\n    :wasIn :{belligerant[2][0]}")
        if len(belligerant[2]) > 0:
            for i in range(1, len(belligerant[2])): file.write(f", :{belligerant[2][i]}")
        file.write(" .\n\n")
    file.write("\n")

    for commander in commanderData:
        file.write(f":{commander[0]} a :Commander ;\n    :hasName \"{commander[1]}\" ;    :hasEndpoint {commander[3]} ;\n    :foughtFor :{commander[2][0]}")
        if len(commander[2]) > 0:
            for i in range(1, len(commander[2])): file.write(f", :{commander[2][i]}")
        file.write(" .\n\n")
    file.write("\n")

    for location in locationData:
        file.write(f":{location[0]} a :Location ;\n    :hasName \"{location[1]}\" .\n\n")
    file.write("\n")

    for side in sideData:
        file.write(f":{side[0]} a :Side ;\n    :foughtIn :{side[1]} ;\n    :isAttacker \"{side[2]}\" .\n\n")