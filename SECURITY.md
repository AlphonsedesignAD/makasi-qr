# 🔐 Sécurité — MAKASI QR

Ce document liste ce qui **peut** être publié et ce qui **ne doit jamais** l'être.

## ✅ Ce qui est déjà sûr

| Élément | Fichier | Pourquoi c'est public |
|---|---|---|
| `SUPABASE_URL` | `js/supabase.js` | Adresse publique du projet Supabase. |
| `SUPABASE_KEY` (`sb_publishable_…`) | `js/supabase.js` | Clé **publishable / anon** : faite pour tourner dans le navigateur. Elle ne donne accès qu'à ce que les règles **RLS** autorisent. |

> Une clé `sb_publishable_…` (ou `anon`) n'est **pas** un secret. Elle est visible par
> n'importe quel visiteur dans l'onglet « Sources ». Ce n'est pas une fuite.

## ❌ Ce qui ne doit JAMAIS être publié

- `SUPABASE_SERVICE_ROLE_KEY` / `service_role` : **contourne toute la sécurité** (RLS inclus).
- Le mot de passe de la base de données.
- Le **Client Secret** Google OAuth (il reste dans le tableau de bord Supabase).
- Tout fichier `.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx`.
- Les jetons personnels GitHub (`ghp_…`), Stripe (`sk_live_…`), AWS (`AKIA…`), etc.

Le fichier `.gitignore` bloque déjà ces fichiers. **Ne le supprimez pas.**

## 🛡️ La vraie protection : la RLS

La sécurité des données ne vient pas de la clé, mais des règles **Row Level Security**.
Elles sont dans `supabase.sql` et doivent être exécutées dans
**Supabase → SQL Editor → Run** :

- `enable row level security` + `force row level security` ;
- 4 politiques limitées à `auth.uid() = user_id` (lire / créer / modifier / supprimer) ;
- `revoke all … from anon` : un visiteur non connecté ne peut rien lire ni écrire.

Sans ces règles, la clé publishable permettrait de lire **toutes** les lignes de la table.
Avec elles, chaque utilisateur ne voit que ses propres QR codes.

### Vérifier que la RLS est active

```sql
select relname, relrowsecurity, relforcerowsecurity
from pg_class
where relname = 'qr_codes';
-- relrowsecurity et relforcerowsecurity doivent être à true
```

## 🔑 Bonnes pratiques

1. **Ne jamais** coller la clé `service_role` dans le code du site.
2. Activer la **confirmation d'e-mail** dans Supabase → Authentication → Providers.
3. Configurer les **Redirect URLs** autorisées pour Google OAuth.
4. Garder les dépendances CDN à jour (versions figées dans les fichiers HTML).
5. En cas de fuite d'une clé sensible : la **révoquer immédiatement** dans le
   tableau de bord, puis la remplacer — supprimer le commit ne suffit pas
   (l'historique Git conserve tout).
6. Activer **GitHub Secret Scanning** et **Dependabot** dans les réglages du dépôt.

## 🚨 Si un secret a déjà été poussé

1. Révoquer / régénérer la clé chez le fournisseur (Supabase, Google, etc.).
2. Nettoyer l'historique (`git filter-repo`) **ou** repartir d'un dépôt neuf.
3. Considérer le secret comme compromis : le retirer du dernier commit ne l'efface pas.

## 📬 Signaler une vulnérabilité

Contact : **Alphonse Design** — merci de ne pas ouvrir d'issue publique pour un
problème de sécurité.
