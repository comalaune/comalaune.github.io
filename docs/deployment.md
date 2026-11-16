# Publication et services

## GitHub Pages

1. Ouvrir les paramètres du dépôt `hugocarolin/ComApo.github.io`, puis **Pages**.
2. Choisir **GitHub Actions** comme source de publication.
3. Le workflow **Publish website** est exécuté à chaque push sur `main`. Il peut aussi être relancé manuellement.

La configuration par défaut utilise `site: https://hugocarolin.github.io` et `base: /ComApo.github.io`. Les liens, les images, le sitemap et les métadonnées respectent ce chemin. Le compte GitHub doit disposer des droits de publication ; le workflow ne contourne pas les protections de branche ou d’environnement.

## Activer les envois Resend

L’intégration est fournie mais l’envoi réel nécessite un compte Resend, une clé et un hébergement pour le Worker. Ne jamais ajouter une clé à une variable `PUBLIC_*`, au code source ou au chat.

### 1. Compte et expéditeur

Créer le compte sur <https://resend.com/signup> avec **com.alaune1@gmail.com**, puis créer une clé limitée à l’envoi d’e-mails.

Tant qu’aucun domaine n’est vérifié, l’expéditeur de test est `Com'Apo <onboarding@resend.dev>`. Resend n’autorise alors l’envoi qu’à l’adresse du compte : elle doit donc être **com.alaune1@gmail.com**. Gmail est le destinataire, pas un domaine d’expédition à usurper. Après l’achat du domaine, le vérifier dans Resend et modifier `RESEND_FROM` dans `api/wrangler.jsonc` pour utiliser une adresse de ce domaine.

### 2. Worker Cloudflare

Créer ou utiliser un compte Cloudflare avec Workers, puis déployer le Worker `comapo-contact`. La liaison `CONTACT_RATE_LIMITER` limite les demandes à cinq par minute et par IP dans chaque emplacement Cloudflare. Le namespace `1001` doit être unique parmi les liaisons de limite de fréquence de ce compte ; le modifier si ce numéro est déjà utilisé pour un autre usage.

**Avec GitHub Actions :** ajouter les secrets suivants à l’environnement `contact-api` (ou au dépôt), puis lancer manuellement **Deploy contact API** :

- `CLOUDFLARE_ACCOUNT_ID` : identifiant du compte.
- `CLOUDFLARE_API_TOKEN` : jeton autorisant le déploiement des Workers sur ce compte.
- `RESEND_API_KEY` : clé d’envoi Resend.

Le workflow transmet la clé en secret au Worker pendant le déploiement. Il ne la publie pas dans les fichiers statiques.

**En local :**

```sh
cp api/.dev.vars.example api/.dev.vars
# Renseigner uniquement la copie locale pour le développement.
npm run api:dev
```

Pour une publication depuis votre terminal authentifié :

```sh
npx wrangler login
npm run api:deploy
npx wrangler secret put RESEND_API_KEY --config api/wrangler.jsonc
```

Le Worker répond sur `https://comapo-contact.<sous-domaine-du-compte>.workers.dev/contact`. Il n’accepte les envois que depuis les origines listées dans `ALLOWED_ORIGINS`. Ne pas ajouter un joker `*`. L’absence de clé ou de liaison de limite de fréquence désactive l’envoi.

### 3. Relier le formulaire

Dans les **Variables** GitHub Actions du dépôt, définir `PUBLIC_CONTACT_ENDPOINT` avec l’URL HTTPS exacte du Worker terminant par `/contact`, puis relancer **Publish website**.

Le formulaire affichera alors « Envoyer mon message ». Avant de considérer l’envoi comme opérationnel, effectuer une demande de test consentie depuis le site et vérifier sa réception dans Gmail ainsi que son état dans Resend. Les tests automatisés simulent Resend et n’envoient aucun e-mail réel.

Pour tester le frontend localement, copier `.env.example` en `.env`, puis définir `PUBLIC_CONTACT_ENDPOINT=http://localhost:8787/contact`. Le fichier `api/.dev.vars` autorise déjà `http://localhost:4321`. Ne pas ajouter cette origine de développement à la configuration de production.

## Google Analytics et Search Console

Définir les variables publiques du dépôt puis relancer la publication :

- `PUBLIC_GOOGLE_ANALYTICS_ID` : identifiant GA4 au format `G-…`. Le script n’est chargé qu’après acceptation ; refuser laisse le site utilisable. Le choix peut être modifié depuis le pied de page.
- `PUBLIC_GOOGLE_SITE_VERIFICATION` : contenu de la balise de validation Search Console.

Aucun identifiant n’est inventé et aucun outil Analytics n’est actif par défaut. Le sitemap est disponible à `/ComApo.github.io/sitemap.xml`.

## Futur nom de domaine

1. Acheter et configurer le domaine dans les paramètres GitHub Pages selon la documentation GitHub.
2. Définir les variables Actions `SITE_URL=https://votre-domaine.fr` et `SITE_BASE_PATH=/`.
3. Ajouter un fichier `public/CNAME` contenant le domaine si nécessaire pour la configuration choisie, puis relancer la publication.
4. Remplacer les origines dans `api/wrangler.jsonc` par les origines exactes du nouveau site et redéployer le Worker. Conserver l’ancienne origine seulement pendant la transition si elle sert encore le site.
5. Vérifier le domaine chez Resend et changer l’expéditeur ; actualiser Search Console et soumettre le nouveau sitemap.

Les données d’immatriculation et les mentions légales complètes devront être ajoutées avec les informations réelles de l’activité lorsqu’elles seront disponibles.

## Références

- [Astro sur GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [API d’envoi Resend](https://resend.com/docs/api-reference/emails/send-email)
- [Domaine Resend de test](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [Limite de fréquence Cloudflare](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
