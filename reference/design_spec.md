# Pohlazení po těle a duši — Design Specification 2026

## Kontext

Redesign homepage masážního studia Mgr. Radky Šebestové v Hodoníně.
Vizuální design je v reference/design.html — odvoď z něj vše vizuální.
Reálný obsah (texty, popisky masáží, bio, kontakty) je na produkčním webu
https://pohlazenipoteleadusi.cz — použij ho, žádné placeholdery.

---

## Sekce a jejich pořadí

Navbar → Hero → Služby → Dárkové poukazy → O mně → Naše studio →
Volné termíny → Kontaktujte mě → Footer

Každá sekce má centrovaný heading v serifovém fontu a krátký podtitulek
v sans-serif. Tento vzor je konzistentní across celou stránku.

---

## Co design.html nevyjadřuje — implementuj toto

### Navbar
Při načtení stránky je průhledný — překrývá hero fotku. Po scrollu dolů přechází
na glassmorphism: rozmazané pozadí, semi-transparentní blush, jemný shadow.
Plynulá transition. Na mobilech hamburger s rozbalovacím drawer menu.

### Hero
Celá výška viewportu. Pozadí je reálná fotka ze studia (první záběr z originálního
webu — svíčky, oleje, teplé světlo). Tmavý teplý overlay zajišťuje čitelnost textu.
Jemný parallax efekt pouze na desktopu — fotka scrolluje pomaleji než obsah.
Obsah hero se při načtení animuje zdola nahoru.
Chevron dole uprostřed s bounce animací zmizí po prvním scrollu uživatele.

### Animace sekcí
Každá sekce při vstupu do viewportu: heading přijíždí shora, ostatní prvky
(karty, bloky) fade-in + slide-up se stagger efektem. Proběhne jednou — neopakuje se.

### Sekce O mně
V design.html tato sekce vyšla jednosloupcová — chceme dvousloupcový layout
na desktopu. Levý sloupec: statistiky, bio, credentials. Pravý sloupec:
portrétní fotka Radky se zaoblenými rohy, zarovnaná na vrch sloupce.
Statistiky (16+ let, 1 500+ klientů, 12 masáží) se při prvním zobrazení
animují count-up efektem.

### Galerie a Kalendář — identické UX
Dva slidery, jeden pattern. Musí být vizuálně i funkčně totožné — stejná
šířka kontejneru, stejné šipky, stejné chování.
Horizontální scroll-snap, drag na desktopu, swipe na mobilu.
Peek dalšího prvku za pravým okrajem naznačí možnost scrollování.
Desktop: 3 prvky + peek. Tablet: 2 + peek. Mobil: 1 + peek.
Kalendář napojit na existující data source — neměnit logiku, pouze UI.
Time sloty jako pill tlačítka: dostupné mají accent border, obsazené jsou
šedé se strikethrough textem.

### Floating buttons
WhatsApp vlevo dole — zachovat zelenou barvu, je okamžitě rozpoznatelná.
Jemná pulse animace. Na hover se vedle ikony rozjede label "Rezervovat termín".
Scroll-to-top vpravo dole — vždy accent barevný, viditelný na jakémkoliv pozadí.
Zobrazí se až po scrollu dolů. Oba buttony stejné velikosti.

### Kontakt
Reálný Google Maps embed (ne placeholder) s adresou studia. Zaoblené rohy.

### Custom scrollbar
Tenká, accent barevná, CSS-only. Ladí do celkového rose-blush stylu.

### Spacing a responzivita
Spacing přes gap na parentu, padding na kontejnerech. Žádné margin-top/bottom
na komponentách — parent určuje pozici child elementů.
Sekce mají větší vertikální padding na desktopu, konzistentně menší na mobilech.
Minimální velikost těla textu na mobilech 15px.
