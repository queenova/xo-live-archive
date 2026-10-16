HOUSE OF XO — XO LIVE ARCHIVE

FICHIERS DU SITE / WEBSITE FILES
- index.html : structure de la page / page structure
- style.css : design, couleurs, animations et affichage mobile / design, colors, animations and responsive layout
- script.js : recherche, filtres, langues, favoris, fiches concert et partage / search, filters, language switch, favourites, concert details and sharing
- concerts.js : données des concerts / concert data
- logo.png : logo House of XO utilisé dans l'en-tête, l'accueil et l'onglet du navigateur / House of XO logo used in the header, hero and browser tab

POUR TESTER / TO TEST
1. Garde les fichiers dans le même dossier / Keep all files in the same folder.
2. Ouvre index.html dans ton navigateur / Open index.html in your browser.

POUR GITHUB PAGES / FOR GITHUB PAGES
Envoie tous les fichiers à la racine du même dépôt GitHub, puis attends la publication de GitHub Pages.
Upload all files to the root of the same GitHub repository, then wait for GitHub Pages to publish.

POUR AJOUTER / MODIFIER UN CONCERT — TO ADD / EDIT A CONCERT
Ouvre concerts.js. Chaque entrée contient date (AAAA-MM-JJ / YYYY-MM-DD), city, country, flag, venue et video. Pour une date sans vidéo, laisse video vide : "video": "".
Edit concerts.js. Each entry contains date, city, country, flag, venue and video. For a concert without a video, leave video empty: "video": "".

NOTES
- Les favoris sont enregistrés uniquement dans le navigateur de chaque visiteur (localStorage). / Favourites are stored only in each visitor's browser.
- Le bouton FR / EN change la langue de l'interface. / The FR / EN button switches the interface language.
- Les noms de pays sont traduits selon la langue sélectionnée. / Country names are translated according to the selected language.
- Les fiches partagées utilisent une URL avec ?concert=AAAA-MM-JJ / Shared concert cards use a URL with ?concert=YYYY-MM-DD.
- Les statistiques sont calculées automatiquement à partir des données de concerts. / Statistics are calculated automatically from the concert data.
- L'archive est un projet fan-made non officiel. Vérifie les dates, lieux et liens vidéo avant publication. / This is an unofficial fan-made archive. Check dates, venues and video links before publishing.


Améliorations UX : boutons « Voir le concert » plus visibles en vert, bouton de langue mieux identifiable, aide FR/EN explicite (masquable), pied de page allégé et mieux structuré.
