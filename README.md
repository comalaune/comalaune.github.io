# Com’ à la une

Site vitrine d’Apolline Deau : community management, communication digitale, création de contenu, communication événementielle et B2B.

**Adresse de publication : https://comalaune.github.io/**

Le dépôt de publication est `comalaune/comalaune.github.io`, sous l’organisation GitHub gratuite `comalaune`. Le site est servi directement à la racine.

Astro et TypeScript, génération statique pour GitHub Pages. Le site porte le nom **Com’ à la une** et conserve le logo fourni. Les visuels et les photos proviennent des documents fournis. Le portrait utilisé sur le site est détouré et amélioré à partir de la photo originale, conservée dans les sources.

## Développement

Node.js 24 ou version supérieure.

```sh
npm ci
npm run dev
```

Adresse locale : `http://localhost:4321/`.

```sh
npm test             # Validation du contact, sans envoyer de mail
npm run check        # Vérification Astro et TypeScript
npm run format:check
npm run build        # Site statique dans dist/
npm run preview      # Vérifier le résultat de production
```

## Publication

Le workflow **Publish website** vérifie et publie `main` sur GitHub Pages. Dans les paramètres du dépôt, sélectionner **Pages → Source → GitHub Actions**.

## Formulaire FormSubmit

Destinataire : **com.alaune1@gmail.com**.

Le formulaire HTML utilise directement FormSubmit, avec un honeypot et la vérification reCAPTCHA du service. Après l’envoi, le visiteur revient sur `https://comalaune.github.io/merci/`. Aucun serveur ni aucune clé API ne sont requis.

**Activation :** FormSubmit demande de confirmer l’adresse destinataire par e-mail lors du premier envoi. La personne qui a accès à cette boîte doit cliquer sur le lien d’activation. Vérifier l’activation pour cette adresse de site, puis la réception d’un envoi réel.

Le [guide de déploiement](docs/deployment.md) détaille l’activation, Analytics/Search Console et le futur nom de domaine.

## Fichiers privés et sources

Le dossier `siteinternet/`, les `.env`, les dépendances et les fichiers générés sont ignorés par Git. Seules les images utiles et destinées au site sont conservées dans `src/assets/`. Les projets fictifs et personnels sont explicitement identifiés.
