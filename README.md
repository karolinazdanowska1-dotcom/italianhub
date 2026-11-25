# ITALIAN LAB – Parla come un italiano

GitHub Pages se publikuje z větve `main` a složky `/docs`.
Web sestaví `cd github-pages && npm ci && npm run build`. Do `docs` přidej po sestavení prázdný soubor `.nojekyll`.

## Supabase

1. V soukromém projektu Supabase spusť jednou SQL z `supabase/migrations/001_study.sql`.
2. V Auth → URL Configuration nastav přesnou adresu GitHub Pages jako Site URL a povolený Redirect URL.
3. Na stránce hubu vyplň URL projektu a jeho veřejný publishable key. Přihlas se odkazem zaslaným na e-mail. Tajný nebo service-role klíč do webu nikdy nevkládej.
4. Pro ověření ulož úkol, otevři hub v druhém prohlížeči, zadej stejný projekt a přihlas se stejným e-mailem. Soubor DOCX nahraj a stáhni z Preply podkladů.

Pokrok, texty a dokumenty jsou oddělené podle přihlášeného uživatele. Lokální režim používá IndexedDB. Původní data a páteční automatizace jsou v aplikaci Sites. Cvičení s výběrem se kontrolují přímo na stránce. Pro posouzení volného textu je v této verzi potřeba předat text do ChatGPT.

Kořenový zdroj zahrnuje původní serverovou implementaci pro Sites. Soukromá konfigurace nasazení a provozní data nejsou součástí repozitáře.
