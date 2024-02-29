# Projet Web Sémantique

## Génération du fichier turtle rassemblant les données au format RDF :

```bash
cd script
pip install -r requirements
python csvToRdf.py
```

## Chargement des données dans Apache Fuseki

- Lancez le serveur fuseki (ATTENTION : vérifier que le port est bien 3030)
- Sur l'interface, créez un nouveau dataset nommé Battles/ et chargez le fichier data/battles.ttl

## Mise en route du site

(ATTENTION : à lancer en parallèle du serveur fuseki)

```bash
cd web
npm run dev
```

Le site sera ainsi lancé et est accessible depuis localhost:5173