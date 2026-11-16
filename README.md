# Com'Apo

Site vitrine d’Apolline Deau : community management, communication digitale, création de contenu, communication événementielle et B2B.

**Site public : https://hugocarolin.github.io/ComApo.github.io/**

Le dépôt appartient à `hugocarolin` : l’adresse `comapo.github.io` ne correspond pas à ce site.

Astro et TypeScript, génération statique pour GitHub Pages. Le site s’appelle **Com’Apo** et conserve le logo fourni **Com’ à la une**. Les visuels et les photos proviennent des documents fournis. Le portrait d’accueil est détouré et amélioré à partir de la photo originale, qui reste conservée pour la section de présentation.

## Développement

Node.js 24 est nécessaire.

```sh
npm ci
npm run dev
```

Adresse locale : `http://localhost:4321/ComApo.github.io/`.

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

Le formulaire HTML utilise directement FormSubmit, avec un honeypot et la vérification reCAPTCHA du service. Après l’envoi, le visiteur revient sur une page de remerciement du site. Aucun serveur ni aucune clé API ne sont requis.

**Activation nécessaire :** le premier envoi déclenche un e-mail de confirmation à l’adresse destinataire. La personne qui a accès à cette boîte doit cliquer sur le lien d’activation. Un envoi et une réception réels restent à vérifier après cette étape.

Le [guide de déploiement](docs/deployment.md) détaille l’activation, Analytics/Search Console et le futur nom de domaine.

## Fichiers privés et sources

Le dossier `siteinternet/`, les `.env`, les dépendances et les fichiers générés sont ignorés par Git. Seules les images utiles et destinées au site sont conservées dans `src/assets/`. Les projets fictifs et personnels sont explicitement identifiés.
