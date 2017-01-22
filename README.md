# IA - Dames

## Setup

### Yarn

Tous les modules sont gérés via [yarn](https://yarnpkg.com/en/docs/).
Résumé des commandes:
```bash
# Installe le module express et
# l'ajoute aux 'dependencies' du package.json
$ yarn add express

# Pareil, mais ajoute le module aux 'devDependencies'
$ yarn add express -D

# Installe les typings correspondant au module
# pour une utilisation avec typescript
$ yarn add @types/leNomDuModule -D
```

### Tests

Ce projet contient des tests unitaires;
Ils sont lancés via la commande suivante:
```bash
$ yarn run test
```

L'ensemble des test est écrit en Typescript, et utilise les frameworks
de test [chai](http://chaijs.com/api/) et [mocha](https://mochajs.org/).

### Gulp


Gulp est utilisé afin de gérer automatiquement le processus de
transpilation du typescript; il ne lance pas automatiquement le
serveur node à chaque modification.

```bash
# Installation de gulp-cli
$ sudo npm install -g gulp-cli

# Ou avec yarn
$ sudo yarn global add gulp-cli

# Démarre la transpilation en continue (watch)
$ gulp
$ gulp watch

# Transpile le javascript
$ gulp typescript:compile
```

### La plateforme

Nous nous sommes chargé de développer le greffon permettant la communication avec la plateforme.
De plus un autre membre a aider au développement de la plateforme.

### L'heuristique

Pour calculer l'heuristique nous nous sommes basés sur plusieurs critères. Premièrement le type de la pièce, si c'est un simple pion
ou bien une dame. Une dame augmente de un le score par rapport à un pion. Ensuite est-ce que cette pièce est
prenable par l'advesaire ou pas, si oui le score augmente de un. Puis on augmente l'heuristique de un pour chaque pièce
adverse que l'on peut prendre avec notre pièce. Et pour finir si la pièce peut devenir une dame le score augmente aussi de un. Une fois
notre heuristique calculé il faut maintenant s'intéresser à l'algorithme.


### Algorithme

L'Algorithme implémenté est négamax dans sa version alpha beta.
Au départ pour chaque fils de la racine un thread est créé afin de réduire
le temps d'execution de l'algorithme et de rendre le traitement de chaque noeud parallèle.

Au lieu de simplement retourner l'heuristique de la feuille, l'algorithme retourne aussi le fils direct
de la racine amenant à cette feuille. On a donc le prochain coup à jouer.

Pour rappel, pour négamax dans sa version alpha-bêta, alpha est initialisé à moins l'infini et bêta est
initialisé à plus l'infini. 

On parcours l'arbre en largeur, c'est à dire que l'on commence toujours par le 
fils le plus à gauche jusqu'à arriver à une feuille où là on remonte pour passer à l'autre fils et ainsi de suite.
Lorsque l'on parcours les fils dans le sens de la descente alpha prend l'inverse de la valeur de bêta, et bêta l'inverse de la valeur
de alpha. 

Lorsque l'on remonte, si alpha est inférieur à l'inverse de la valeur remontée alors alpha prend cette valeur.
Si alpha est supérieur à bêta on élague les fréres du noeud actuel et on ignore les valeurs récupérées au parcours du noeud actuel.

L'algorithme se termine lorsque le parcours de l'arbre est terminé et que la valeur de alpha est rémonté jusqu'à la racine.

Voici ci-dessous l'algorithme implémenté en pseudo code :

```
fonction ALPHABETA(P, A, B) /* A < B */
   si P est une feuille alors
       retourner la valeur de P
   sinon
       Meilleur = –INFINI
       pour tout enfant Pi de P faire
           Val = -ALPHABETA(Pi,-B,-A)
           si Val > Meilleur alors
               Meilleur = Val
               si Meilleur > A alors
                   A = Meilleur
                   si A ≥ B alors
                       retourner Meilleur
                   finsi
               finsi
           finsi 
       finpour 
       retourner Meilleur
   finsi
fin

```