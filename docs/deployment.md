# Publication et services

## Adresse du site

L’adresse publique est **https://hugocarolin.github.io/ComApo.github.io/**.

`https://comapo.github.io/` est une autre adresse : elle correspondrait à un site publié par le compte GitHub `ComApo`. Le dépôt actuel appartient à l’organisation `hugocarolin`, donc son nom seul ne crée pas ce sous-domaine.

La configuration utilise `site: https://hugocarolin.github.io` et `base: /ComApo.github.io`. Les liens, les images et les métadonnées respectent ce chemin. L’ancien domaine personnalisé du site principal a été retiré pour supprimer sa redirection héritée.

## GitHub Pages

Le workflow **Publish website** vérifie et publie automatiquement `main`. Dans les paramètres du dépôt `hugocarolin/ComApo.github.io`, **Pages → Source** doit rester sur **GitHub Actions**. Il est également possible de relancer le workflow manuellement.

## Formulaire FormSubmit

Le formulaire envoie directement un POST HTML vers **https://formsubmit.co/com.alaune1@gmail.com**. Aucun serveur séparé, compte Resend ou clé API n’est nécessaire.

Les champs portent un attribut `name`. Le sujet indique Com’Apo et le besoin choisi, le modèle d’e-mail est `table`, le champ `email` permet de répondre au visiteur, et le champ `_honey` sert de piège anti-spam. La vérification reCAPTCHA par défaut est conservée sur la page de FormSubmit. Après l’envoi, `_next` ramène le visiteur à **https://hugocarolin.github.io/ComApo.github.io/merci/**.

### Activation de l’adresse

Au premier envoi, FormSubmit demande de confirmer **com.alaune1@gmail.com** par e-mail. Ouvrir le message reçu à cette adresse, puis cliquer sur le lien d’activation. Vérifier aussi les courriers indésirables. Cette confirmation doit être réalisée par la personne qui a accès à la boîte mail.

Une fois l’adresse activée, envoyer une demande de test consentie depuis le site et vérifier sa réception. La compilation et les tests automatiques ne déclenchent aucun e-mail réel. Ne pas confondre une soumission au service avec la vérification de sa réception dans Gmail.

Le formulaire reste utilisable sans JavaScript. Le script local ajoute une validation et un sujet adapté au service choisi ; le navigateur conserve l’envoi HTML et la vérification anti-spam du prestataire. La page de confidentialité explique ce transfert.

## Google Analytics et Search Console

Configurer ces variables publiques GitHub Actions, puis relancer la publication :

- `PUBLIC_GOOGLE_ANALYTICS_ID` : identifiant GA4 au format `G-…`. Le script n’est chargé qu’après acceptation ; le choix peut être modifié dans le pied de page.
- `PUBLIC_GOOGLE_SITE_VERIFICATION` : contenu de la balise Search Console.

Aucun outil Analytics n’est actif par défaut. Le sitemap est disponible à **https://hugocarolin.github.io/ComApo.github.io/sitemap.xml**.

## Futur nom de domaine

1. Configurer le domaine dans GitHub Pages selon la documentation GitHub.
2. Définir les variables Actions `SITE_URL=https://votre-domaine.fr` et `SITE_BASE_PATH=/`.
3. Ajouter un fichier `public/CNAME` si la configuration choisie le nécessite, puis relancer la publication.
4. La redirection du formulaire et les métadonnées seront générées avec la nouvelle adresse. Vérifier l’activation FormSubmit sur ce nouveau domaine.
5. Actualiser Search Console et soumettre le nouveau sitemap.

Les mentions légales complètes devront être ajoutées avec les informations réelles de l’activité lorsqu’elles seront disponibles.

## Références

- [Astro sur GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Configuration FormSubmit](https://formsubmit.co/)
- [Paramètres avancés FormSubmit](https://formsubmit.co/documentation)
