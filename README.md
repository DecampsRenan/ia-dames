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

