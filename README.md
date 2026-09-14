# Todornaut 🚀

En workshop om moderne webplattform.

Webplattformen har utviklet seg enormt de siste årene. Ting vi før dro inn rammeverk,
biblioteker og hauger av JavaScript for, er nå innebygd i nettleseren — i HTML og CSS.
`:has()`, view transitions, `@starting-style`, anchor positioning, popover, scroll-drevne
animasjoner og invoker commands er tilgjengelig i alle moderne nettlesere.

Spørsmålet vi skal svare på: **hvor langt kommer vi med kun HTML og CSS, uten en eneste
linje JavaScript i nettleseren?**

Vi finner det ut ved å bygge videre på en todo-app. Serveren er ferdig og med vilje kjedelig:
Express, EJS og en JSON-fil. All moroa skjer i `public/index.css`.

**Én regel:** ingen JavaScript i nettleseren. Ingen htmx, ingen Alpine, ingen inline `onclick`.
Ingenting.

## Oppsett

```bash
git clone git@github.com:sveinpg/entur-faggruppe-moderne-web-html.git
cd entur-faggruppe-moderne-web-html
npm install
npm start
```

Appen kjører på <http://localhost:3000>. `npm start` bruker nodemon, så serveren restarter
automatisk når du endrer filer. Endringer i CSS krever bare en refresh.

### Prosjektstruktur

```
package.json
server.js         # Express-server, fire ruter, ingenting mer
views/index.ejs   # Hele HTML-en
public/index.css  # Her jobber du
todos.json        # "Databasen". Slett den for å nullstille.
```

Todo-modellen er `{ id, description, completed }`, og rutene er:

| Rute | Hva den gjør |
| --- | --- |
| `GET /` | Rendrer alle todos |
| `POST /todo` | Oppretter ny todo, redirect til `/` |
| `POST /todo/:id/toggle` | Toggler `completed`, redirect til `/` |
| `POST /todo/:id/delete` | Sletter todo, redirect til `/` |

Merk at hver `<li>` allerede har `view-transition-name: todo-<id>`, og at checkboxen i hver
todo speiler `completed`-statusen fra serveren. De to detaljene er alt du trenger for å komme
langt.

---

## Stegvis guide

Stegene er uavhengige nok til at du kan hoppe over noen, men de bygger fint på hverandre.
Løsningsforslagene er *et* forslag — ikke fasit.

### Steg 1: Gjennomstreking med `:has()`

I referanse-appen sendte serveren ut en inline `text-decoration: line-through` når en todo var
fullført. Det er unødvendig: nettleseren vet allerede om checkboxen er huket av.

**Oppgave:** Stryk over teksten til fullførte todos ved hjelp av CSS alene, basert på
checkbox-tilstanden. Ingen ekstra klasser fra serveren.

<details>
<summary>Hint</summary>

- `:has()` er en *parent selector*: `.todo:has(input:checked)` matcher en todo som inneholder
  en avhuket checkbox.
- Du kan også kombinere med søskenselektorer: `input:checked ~ .description`.
- Prøv å style hele raden, ikke bare teksten — f.eks. dempet farge og redusert opacity.
- [MDN: `:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN: `:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
.todo:has(input[type="checkbox"]:checked) .description {
  text-decoration: line-through;
  color: gray;
}

/* Eller uten :has(), med søskenselektor: */
input[type="checkbox"]:checked ~ .description {
  text-decoration: line-through;
}
```

Poenget: tilstanden bor i DOM-en, ikke i en klasse serveren måtte regne ut.

</details>

### Steg 2: CSS counters

**Oppgave:** Vis antall gjenstående (ikke-fullførte) todos — uten JavaScript og uten at serveren
teller for deg.

<details>
<summary>Hint</summary>

- `counter-reset` på lista, `counter-increment` på elementene du vil telle.
- Kombiner med `:has()` fra steg 1 for å telle *bare* de ikke-avhukede: øk telleren med 0 for
  fullførte todos.
- Tellere kan bare vises via `content` i `::before`/`::after`, så du trenger et element å henge
  det på — f.eks. `.todos::after`.
- `counter()` kan formateres: `counter(remaining, decimal)`.
- [MDN: Using CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)
- [MDN: `counter-increment`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
.todos {
  counter-reset: remaining;
}

.todo {
  counter-increment: remaining;
}

.todo:has(input:checked) {
  counter-increment: remaining 0;
}

.todos::after {
  content: counter(remaining) " gjenstår";
  display: block;
  color: gray;
  font-size: 0.9rem;
}
```

Bonus: nummerer todos med en egen teller, og bruk `counter-reset: done 0` + en andre teller for
"X av Y fullført".

</details>

### Steg 3: View Transitions

`public/index.css` inneholder allerede:

```css
@view-transition {
  navigation: auto;
}
```

Det gjør at hver navigasjon — også form-posten og redirecten etterpå — animeres i stedet for å
blinke. Hver `<li>` har `view-transition-name: todo-<id>`, så nettleseren kan matche samme todo
på tvers av sidelastninger.

**Oppgave:** Utforsk hva som allerede skjer, og tilpass animasjonene. Gi nye og slettede todos
ulik overgang.

<details>
<summary>Hint</summary>

- Slå av `@view-transition`-regelen en runde og sammenlign. Det er lettere å se hva den gjør når
  den er borte.
- Pseudo-elementene `::view-transition-old(navn)` og `::view-transition-new(navn)` er der du
  legger animasjonene. Bruk `*` for å treffe alle, eller `todo-3` for én bestemt.
- Et element som bare finnes *etter* navigasjonen har bare `::view-transition-new` — det er din
  "ny todo"-animasjon. Et som forsvinner har bare `::view-transition-old`.
- `view-transition-name` må være unikt per side. Det er derfor id-en er med i navnet.
- DevTools → Animations lar deg sakke ned avspillingen.
- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [MDN: `@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
@keyframes slide-in {
  from { opacity: 0; transform: translateX(-2rem); }
}

@keyframes fade-out {
  to { opacity: 0; transform: translateX(2rem) scale(0.9); }
}

::view-transition-new(*):only-child {
  animation: slide-in 300ms ease-out;
}

::view-transition-old(*):only-child {
  animation: fade-out 250ms ease-in;
}
```

`:only-child` treffer tilfellene der bare *én* av gammel/ny finnes — altså elementer som kommer
til eller forsvinner. Todos som finnes i begge tilstander får den innebygde morph-animasjonen,
som er akkurat det vi vil ha når en todo bare flytter på seg.

Prøv også `view-transition-class` hvis du vil gruppere flere navn under én regel.

</details>

### Steg 4: Animasjoner med `@starting-style`

View transitions dekker navigasjoner. `@starting-style` dekker det mer generelle tilfellet: hva
skal et element animere *fra* når det dukker opp for første gang?

**Oppgave:** Animer nye todos inn i lista.

<details>
<summary>Hint</summary>

- Et element som nettopp er lagt til i DOM-en har ingen "forrige" verdi å transitionere fra —
  `@starting-style` gir den.
- Formen er: sett sluttilstanden på selektoren, og starttilstanden i
  `@starting-style { .todo { ... } }`.
- Du trenger en `transition` på elementet for at det skal skje noe.
- For elementer som forsvinner trenger du `transition-behavior: allow-discrete` og eventuelt
  `@keyframes` — `display` kan ikke transitionere uten det.
- [MDN: `@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style)
- [MDN: `transition-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
.todo {
  opacity: 1;
  translate: 0;
  transition: opacity 300ms ease, translate 300ms ease;
}

@starting-style {
  .todo {
    opacity: 0;
    translate: 0 -1rem;
  }
}
```

Merk at dette og view transitions kan komme i veien for hverandre. Diskuter i gruppa: når er
`@starting-style` riktig verktøy, og når er view transitions det?

</details>

### Steg 5: Popover og dialog

Slettebekreftelsen bruker allerede `<dialog>` og *invoker commands*
(`command="show-modal" commandfor="...")` — helt uten JavaScript. Den ser bare ikke spesielt bra
ut ennå.

**Oppgave:** Style dialogen, inkludert backdrop og åpne-/lukke-animasjon. Utforsk deretter
popover som alternativ.

<details>
<summary>Hint</summary>

- `dialog::backdrop` styles som et vanlig element: `background`, `backdrop-filter`, animasjoner.
- `dialog:open` (eller `dialog[open]`) er tilstanden når den er åpen — kombiner med
  `@starting-style` fra steg 4.
- For å animere lukking trenger du `transition-behavior: allow-discrete` på `display` og
  `overlay`.
- Popover-varianten: `<button popovertarget="min-popover">` + `<div popover>`. Lettere enn
  dialog, men ikke modal og fanger ikke fokus.
- `command`/`commandfor` er den nye, deklarative måten å styre dialog og popover på —
  `command="show-modal"`, `command="close"`, `command="toggle-popover"`.
- [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [MDN: `command`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#command)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
dialog {
  border: none;
  border-radius: 0.75rem;
  padding: 1.5rem;
  opacity: 1;
  scale: 1;
  transition: opacity 200ms, scale 200ms, display 200ms allow-discrete,
              overlay 200ms allow-discrete;
}

dialog:not(:open) {
  opacity: 0;
  scale: 0.95;
}

@starting-style {
  dialog:open {
    opacity: 0;
    scale: 0.95;
  }
}

dialog::backdrop {
  background: rgb(0 0 0 / 0.4);
  backdrop-filter: blur(2px);
}
```

Popover-varianten i HTML, hvis du vil prøve:

```html
<button popovertarget="info-1">Info</button>
<div id="info-1" popover>Litt mer informasjon om denne todoen.</div>
```

</details>

### Steg 6: Anchor positioning

**Oppgave:** Posisjoner en tooltip eller popover relativt til en bestemt todo — uten
JavaScript-basert posisjonsberegning.

<details>
<summary>Hint</summary>

- Ankeret får `anchor-name: --et-navn`, elementet som skal posisjoneres får
  `position-anchor: --et-navn` og `position: absolute` (eller `fixed`).
- `top: anchor(bottom)` og `left: anchor(left)` plasserer deg relativt til ankeret.
- `position-area: bottom center` er en enklere snarvei for de vanlige plasseringene.
- `position-try-fallbacks: flip-block, flip-inline` gjør at tooltipen snur når den ikke får
  plass — det er akkurat dette man ellers drar inn Floating UI for.
- Et popover-element ligger i top layer, og anchor positioning er laget for nettopp den
  kombinasjonen.
- Ankernavn må være unike per element, så du trenger et per todo. Diskuter hva som er minst
  vondt her: en `style`-attributt fra serveren, eller `anchor-name: attr(...)`?
- [MDN: CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning)
- [MDN: `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area)

</details>

<details>
<summary>Løsningsforslag</summary>

```css
.todo summary {
  anchor-name: --todo-anchor;
}

.todo [popover] {
  position: absolute;
  position-anchor: --todo-anchor;
  position-area: bottom span-right;
  margin: 0.5rem 0 0;
  position-try-fallbacks: flip-block, flip-inline;
}
```

Fungerer det for én todo, men ikke for alle? Det er hele poenget med at ankernavn må være unike.
Én løsning er å la serveren skrive ut `anchor-name: --todo-<id>` per element, på samme måte som
`view-transition-name` allerede gjøres i `views/index.ejs`.

</details>

### Steg 7: Filtrering med CSS

**Oppgave:** Legg til filtrering — alle / aktive / fullførte — med radioknapper. Ingen
server-runde, ingen JavaScript.

<details>
<summary>Hint</summary>

- Tre `<input type="radio" name="filter">` med hver sin `<label for="...">`. Legg dem *utenfor*
  todo-lista, som søsken til `<ul>`, slik at du kan bruke søskenselektorer.
- Kombiner `:checked` på radioen med `:has()` på todoen:
  `#filter-active:checked ~ .todos .todo:has(input:checked) { display: none; }`
- Husk at radioknappene bare er visuell tilstand — ikke send dem til serveren.
- Ekstra: `:has()` på `<body>` lar deg style hva som helst basert på valgt filter, ikke bare
  lista.
- Tenk på a11y: bruk ekte labels, og vurder `display: none` vs. `content-visibility`.
- [MDN: `:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)
- [MDN: Subsequent-sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator)

</details>

<details>
<summary>Løsningsforslag</summary>

I `views/index.ejs`, rett før `<ul class="todos">`:

```html
<fieldset class="filters">
    <input type="radio" id="filter-all" name="filter" checked />
    <label for="filter-all">Alle</label>

    <input type="radio" id="filter-active" name="filter" />
    <label for="filter-active">Aktive</label>

    <input type="radio" id="filter-done" name="filter" />
    <label for="filter-done">Fullførte</label>
</fieldset>
```

I CSS:

```css
#filter-active:checked ~ .todos .todo:has(input[type="checkbox"]:checked) {
  display: none;
}

#filter-done:checked ~ .todos .todo:not(:has(input[type="checkbox"]:checked)) {
  display: none;
}
```

Legg merke til at telleren fra steg 2 fortsatt oppfører seg riktig — CSS counters teller også
skjulte elementer. Er det ønsket oppførsel? Diskuter.

</details>

### Steg 8: Scroll-drevne animasjoner

**Oppgave:** Animer elementer basert på scroll-posisjon. Legg inn nok todos til at siden faktisk
scroller først.

<details>
<summary>Hint</summary>

- To tidslinjer å velge mellom: `scroll()` (hvor langt scrollcontaineren har kommet) og `view()`
  (hvor elementet er i viewporten).
- `animation-timeline: view();` + `animation-range: entry 0% cover 30%;` gir den klassiske
  "fade inn når den kommer til syne"-effekten.
- En fremdriftsindikator på toppen: et fast posisjonert element med
  `animation-timeline: scroll(root block);` og `scaleX` fra 0 til 1.
- Animasjonen må ha `animation-name` og `animation-duration: auto` — varigheten styres av
  tidslinjen, ikke av klokka.
- Pakk gjerne inn i `@supports (animation-timeline: view())` og respekter
  `prefers-reduced-motion`.
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
- [scroll-driven-animations.style](https://scroll-driven-animations.style/) — mange eksempler

</details>

<details>
<summary>Løsningsforslag</summary>

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@supports (animation-timeline: view()) {
  .todo {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .todo { animation: none; }
}
```

Fremdriftsindikator:

```css
@keyframes grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}

body::before {
  content: "";
  position: fixed;
  inset: 0 0 auto;
  height: 4px;
  background: rebeccapurple;
  transform-origin: left;
  animation: grow linear both;
  animation-timeline: scroll(root block);
}
```

</details>

---

## Til slutt

Hvor langt kom vi? Gå gjennom i gruppa:

- Hva føltes naturlig i CSS, og hva føltes som et triks som ikke hører hjemme der?
- Hvor gikk grensen — hva krevde faktisk JavaScript?
- Hvilke av disse ville du tatt i bruk i produksjon i morgen?

### Ressurser

- [MDN: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [web.dev: Baseline](https://web.dev/baseline)
- [Can I use](https://caniuse.com/)
- [Chrome for Developers: New in Chrome](https://developer.chrome.com/blog)
