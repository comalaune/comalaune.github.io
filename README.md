# Com'Apo

Site vitrine d’Apolline Deau : community management, communication digitale, création de contenu, communication événementielle et B2B.

Astro et TypeScript, génération statique pour GitHub Pages. Le site s’appelle **Com’Apo** et conserve le logo fourni **Com’ à la une**. Les photos et les visuels de projets proviennent des documents fournis ; aucun portrait généré n’est utilisé.

## Développement

Node.js 24 est nécessaire.

```sh
npm ci
npm run dev
```

Adresse locale : `http://localhost:4321/ComApo.github.io/`.

```sh
npm test             # Validation et API de contact, sans envoyer de mail
npm run check        # Vérification Astro et TypeScript
npm run format:check
npm run build        # Site statique dans dist/
npm run preview      # Vérifier le résultat de production
```

## Publication

Le workflow **Publish website** vérifie et publie `main` sur GitHub Pages. Dans les paramètres du dépôt, sélectionner **Pages → Source → GitHub Actions**.

Adresse prévue : <https://hugocarolin.github.io/ComApo.github.io/>. Le nom du dépôt n’accorde pas le sous-domaine `ComApo.github.io`, qui dépendrait d’un compte GitHub nommé ComApo.

## Formulaire et Resend

Destinataire fixe : **com.alaune1@gmail.com**.

GitHub Pages ne peut pas exécuter l’API Resend. Le dossier `api/` contient donc un Worker Cloudflare séparé, avec validation, contrôle d’origine, limite de taille, honeypot, limite de fréquence et idempotence. La clé reste côté serveur.

**État initial :** aucun compte ni aucune clé Resend n’étant disponible à la création du site, le formulaire prépare un message dans la messagerie du visiteur. Il ne prétend pas avoir envoyé le message. L’envoi direct est activé en configurant `PUBLIC_CONTACT_ENDPOINT` après déploiement du Worker.

Consulter [le guide de déploiement](docs/deployment.md) pour activer Resend, configurer les secrets, ajouter Analytics/Search Console ou passer à un nom de domaine personnalisé.

## Fichiers privés et sources

Le dossier `siteinternet/`, les `.env`, les secrets du Worker, les dépendances et les fichiers générés sont ignorés par Git. Seules les images utiles et destinées au site sont conservées dans `src/assets/`. Les projets fictifs et personnels sont explicitement identifiés.
