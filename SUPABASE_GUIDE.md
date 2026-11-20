# Base de données en ligne sécurisée (Supabase) — MAKASI QR

## 1. Créer le projet
1. Allez sur https://supabase.com, créez un compte, puis **New project**.
2. Nom : `makasi-qr`. Choisissez un **mot de passe de base de données** solide et notez-le (vous ne l'utiliserez pas dans le site). Région : la plus proche de vos utilisateurs.

## 2. Créer la table et la sécurité
1. Menu **SQL Editor** > **New query**.
2. Collez tout le contenu de `supabase.sql` > **Run**.
3. Vérifiez dans **Table Editor** > `qr_codes` : le badge « RLS enabled » doit apparaître.

Ce que fait ce SQL : chaque QR code est lié à son propriétaire (`user_id`). Les règles RLS (Row Level Security) font que la base elle-même refuse à un utilisateur de lire, modifier ou supprimer les lignes d'un autre, même s'il manipule le code du site. Les contraintes limitent aussi la taille et le type des données.

## 3. Régler l'authentification
**Authentication > Providers > Email** : gardez « Confirm email » activé (empêche les faux comptes).
**Authentication > Sign In / Providers > Password** : longueur minimale 8, et activez la protection contre les mots de passe compromis si l'option existe sur votre offre.
**Authentication > URL Configuration** : *Site URL* = l'adresse de votre site Vercel (ex. `https://makasi-qr.vercel.app`) ; ajoutez-la aussi dans *Redirect URLs*.

## 4. Brancher le site
1. **Project Settings > API** : copiez **Project URL** et la clé **anon public**.
2. Dans `js/supabase.js`, remplissez `SUPABASE_URL` et `SUPABASE_KEY`.
3. ⚠️ Ne mettez JAMAIS la clé `service_role` dans le site : elle contourne toute la sécurité. La clé `anon` est faite pour être publique, c'est la RLS qui protège les données.

## 5. Déployer (Vercel)
Déployez le dossier `qr-studio` tel quel. Le fichier `vercel.json` ajoute les protections du navigateur (CSP, HTTPS strict, anti-clickjacking). Si vous changez de projet Supabase, vérifiez que son adresse correspond à `connect-src` dans ce fichier.

## 6. Tester la sécurité
1. Créez deux comptes (A et B) avec deux e-mails.
2. Avec A, enregistrez un QR code. Avec B, vérifiez qu'il n'apparaît pas dans « Mes QR codes ».
3. Tableau Supabase : **Authentication > Users** doit lister A et B ; **Table Editor** montre leurs `user_id` différents.

## Bonnes pratiques
- Activez la **2FA** sur votre compte Supabase et GitHub.
- Ne partagez jamais le mot de passe de la base ni la clé `service_role`.
- Sauvegardes : Project Settings > Database > Backups (selon l'offre).

## 7. « Continuer avec Google »
1. https://console.cloud.google.com > créez un projet > **APIs & Services > OAuth consent screen** (type External, nom MAKASI QR, votre e-mail).
2. **Credentials > Create credentials > OAuth client ID** > *Web application*.
   - Authorized redirect URI : `https://VOTRE-REF.supabase.co/auth/v1/callback`
3. Copiez le **Client ID** et le **Client Secret**.
4. Supabase > **Authentication > Sign In / Providers > Google** : activez, collez les deux valeurs, enregistrez.
5. **Authentication > URL Configuration** : ajoutez l'adresse de votre site dans *Redirect URLs*.

## Fonctionnement sans compte
Le site est utilisable sans compte : les QR codes restent sur l'appareil. Quand l'utilisateur crée un compte ou se connecte, ceux créés avant sont ajoutés automatiquement à son compte.
