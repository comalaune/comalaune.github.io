# Publication et services

## Adresse du site

L’adresse de publication est **https://comalaune.github.io/**.

Cette adresse appartient à l’organisation GitHub `comalaune`. Le dépôt doit s’appeler exactement `comalaune.github.io`. La configuration utilise `site: https://comalaune.github.io` et `base: /` pour servir les pages, les images et les métadonnées à la racine.

## GitHub Pages

Le workflow **Publish website** vérifie et publie automatiquement `main`. Dans les paramètres du dépôt `comalaune/comalaune.github.io`, **Pages → Source** doit être sur **GitHub Actions**. Il est également possible de relancer le workflow manuellement.

Les variables Actions `SITE_URL` et `SITE_BASE_PATH` sont facultatives : leurs valeurs par défaut correspondent à cette adresse. Si elles sont définies, elles doivent contenir respectivement `https://comalaune.github.io` et `/`.

Après un transfert de dépôt, vérifier les paramètres Pages, les autorisations Actions, l’environnement `github-pages` et ces variables avant le premier déploiement. Le transfert du dépôt ne garantit pas une redirection de l’ancienne adresse Pages.

## Formulaire FormSubmit

Le formulaire envoie directement un POST HTML vers **https://formsubmit.co/com.alaune1@gmail.com**. Aucun serveur séparé ni clé API n’est nécessaire.

Les champs portent un attribut `name`. Le sujet indique Com’ à la une et le besoin choisi, le modèle d’e-mail est `table`, le champ `email` permet de répondre au visiteur, et le champ `_honey` sert de piège anti-spam. La vérification reCAPTCHA par défaut est conservée sur la page de FormSubmit. Après l’envoi, `_next` ramène le visiteur à **https://comalaune.github.io/merci/**.

### Activation de l’adresse

Au premier envoi, FormSubmit demande de confirmer **com.alaune1@gmail.com** par e-mail. Ouvrir le message reçu à cette adresse, puis cliquer sur le lien d’activation. Vérifier aussi les courriers indésirables. Cette confirmation doit être réalisée par la personne qui a accès à la boîte mail.

Vérifier l’activation sur le nouveau domaine. Une fois l’adresse activée, envoyer une demande de test consentie depuis le site et vérifier sa réception. La compilation et les tests automatiques ne déclenchent aucun e-mail réel.

Le formulaire reste utilisable sans JavaScript. Le script local ajoute une validation et un sujet adapté au service choisi ; le navigateur conserve l’envoi HTML et la vérification anti-spam du prestataire. La page de confidentialité explique ce transfert.

## Google Analytics et Search Console

Configurer ces variables publiques GitHub Actions, puis relancer la publication :

- `PUBLIC_GOOGLE_ANALYTICS_ID` : identifiant GA4 au format `G-…`. Le script n’est chargé qu’après acceptation ; le choix peut être modifié dans le pied de page.
- `PUBLIC_GOOGLE_SITE_VERIFICATION` : contenu de la balise Search Console.

Aucun outil Analytics n’est actif par défaut. Le sitemap est disponible à **https://comalaune.github.io/sitemap.xml**.

## Futur nom de domaine

1. Configurer le domaine dans GitHub Pages selon la documentation GitHub.
2. Définir les variables Actions `SITE_URL=https://votre-domaine.fr` et `SITE_BASE_PATH=/`.
3. Ajouter un fichier `public/CNAME` si la configuration choisie le nécessite, puis relancer la publication.
4. La redirection du formulaire et les métadonnées seront générées avec la nouvelle adresse. Vérifier l’activation FormSubmit sur ce nouveau domaine.
5. Actualiser Search Console et soumettre le nouveau sitemap.

Les mentions légales complètes devront être ajoutées avec les informations réelles de l’activité lorsqu’elles seront disponibles.

## Références

- [Créer un site GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Transférer un dépôt GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
- [Astro sur GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Configuration FormSubmit](https://formsubmit.co/)
- [Paramètres avancés FormSubmit](https://formsubmit.co/documentation)
