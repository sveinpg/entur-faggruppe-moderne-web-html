# 🚋 Rutine

> **Gjøremål på skinner.** En workshop om hvor langt moderne HTML og CSS tar deg — uten en
> eneste linje JavaScript i nettleseren.

---

## 🎯 Hva handler dette om?

Webplattformen har utviklet seg enormt de siste årene. Ting vi før dro inn rammeverk, biblioteker
og hauger av JavaScript for, er nå innebygd i nettleseren: `:has()`, view transitions,
`@starting-style`, anchor positioning, popover og scroll-drevne animasjoner.

**Spørsmålet vi skal svare på:** hvor langt kommer vi med kun HTML og CSS?

Vi finner det ut ved å bygge videre på en todo-app. Serveren er ferdig og med vilje kjedelig:
Express, EJS og en JSON-fil. Grunnstylingen er på plass. Resten er din.

> 🚫 **Én regel:** ingen JavaScript i nettleseren. Ingen htmx, ingen Alpine, ingen `onclick`.
> Ingenting.

---

## 🚀 Kom i gang

> ⚠️ **Sjekk nettleseren din først:** **Chrome 135+**, **Safari 26+** eller **Firefox 140+**.
> Er du i tvil, kjør Chrome.
>
> Særlig `command`/`commandfor` er ferskt. På en eldre nettleser skjer det rett og slett
> ingenting når du trykker Delete, og holdeplass 5 faller sammen.

```bash
git clone git@github.com:sveinpg/entur-faggruppe-moderne-web-html.git
cd entur-faggruppe-moderne-web-html
npm install
npm start
```

👉 Appen kjører på **<http://localhost:3000>**

CSS-en du skal jobbe i ligger i **`public/index.css`**. `npm start` bruker nodemon, så serveren
restarter når du endrer filer — CSS-endringer trenger bare en refresh.

---

## 🛤️ Ruta

| | Holdeplass | Tema |
| --- | --- | --- |
| 1️⃣ | [Gjennomstreking](#1️⃣-gjennomstreking-med-has) | `:has()` |
| 2️⃣ | [Antall gjenstående](#2️⃣-antall-gjenstående-med-css-counters) | CSS counters |
| 3️⃣ | [Sideoverganger](#3️⃣-sideoverganger-med-view-transitions) | View Transitions |
| 4️⃣ | [Nye todos glir inn](#4️⃣-nye-todos-glir-inn-med-starting-style) | `@starting-style` |
| 5️⃣ | [Slettedialogen](#5️⃣-slettedialogen-med-dialog-og-popover) | `<dialog>` & popover |
| 6️⃣ | [Tooltip på plass](#6️⃣-tooltip-på-plass-med-anchor-positioning) | Anchor positioning |
| 7️⃣ | [Filtrering](#7️⃣-filtrering-uten-en-eneste-linje-js) | `:has()` igjen |
| 8️⃣ | [Scroll-effekter](#8️⃣-scroll-effekter) | Scroll-drevne animasjoner |

**1–5 er hovedruta.** Rekker du bare tre, ta 1, 2 og 3 — de gir mest igjen for innsatsen.
**6–8 er utflukter** for de som kommer raskt fram.

Hvert steg har 💡 **Hint** og ✅ **Løsningsforslag** i utslåbare blokker. Løsningsforslaget er
*et* forslag — ikke fasit.

> 🤖 **Bruker du Claude Code?** Repoet har en `CLAUDE.md` som ber Claude om å diskutere, stille
> spørsmål og finne dokumentasjon — men aldri skrive koden for deg. Det er med vilje: hele
> poenget er at CSS-en skal gjennom fingrene dine.

---

### 1️⃣ Gjennomstreking med `:has()`

Den enkle måten er å la serveren sende med en `completed`-klasse, eller en inline
`text-decoration: line-through`, på hver fullførte todo. Men det er unødvendig arbeid:
nettleseren vet allerede om checkboxen er huket av.

**🎯 Oppgave:** Stryk over teksten til fullførte todos med CSS alene. Ingen ekstra klasser fra
serveren.

> ☑️ **Merk at checkboxen ikke gjør noe alene** — du må trykke «Toggle» for at endringen skal
> lagres. Det er ikke en bug: checkboxen viser bare tilstanden serveren kjenner til, og en
> checkbox kan ikke sende et skjema av seg selv. Knappen er prisen for å slippe én linje
> JavaScript, og den diskusjonen tar vi på [🏁 Endestasjon](#-endestasjon).

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `:has()` er en **parent selector**: `.todo:has(input:checked)` matcher en todo som *inneholder*
  en avhuket checkbox.
- Du kan også bruke søskenselektor: `input:checked ~ .description`.
- Prøv å style hele raden, ikke bare teksten — dempet farge, redusert opacity.

📖 [MDN: `:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/:has) ·
[MDN: `:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

🔑 **Poenget:** tilstanden bor i DOM-en, ikke i en klasse serveren måtte regne ut.

</details>

---

### 2️⃣ Antall gjenstående med CSS counters

**🎯 Oppgave:** Vis antall gjenstående (ikke-fullførte) todos — uten JavaScript, og uten at
serveren teller for deg.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `counter-reset` på lista, `counter-increment` på elementene du vil telle.
- Kombiner med `:has()` fra forrige steg for å telle **bare** de ikke-avhukede: øk telleren med
  `0` for fullførte todos.
- Tellere vises bare via `content` i `::before`/`::after` — du trenger et element å henge det på,
  f.eks. `.todos::after`.

📖 [MDN: Using CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters) ·
[MDN: `counter-increment`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

🎁 **Bonus:** nummerer todos med en egen teller, og bruk en andre teller for «X av Y fullført».

</details>

---

### 3️⃣ Sideoverganger med View Transitions

`public/index.css` inneholder allerede:

```css
@view-transition {
  navigation: auto;
}
```

Det gjør at hver navigasjon — også form-posten og redirecten etterpå — animeres i stedet for å
blinke. Hver `<li>` har `view-transition-name: todo-<id>`, så nettleseren kan matche samme todo
på tvers av sidelastninger.

**🎯 Oppgave:** Utforsk hva som allerede skjer, og tilpass animasjonene. Gi nye og slettede todos
ulik overgang.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- 🔌 Slå av `@view-transition`-regelen en runde og sammenlign. Lettere å se hva den gjør når den
  er borte.
- Pseudo-elementene `::view-transition-old(navn)` og `::view-transition-new(navn)` er der
  animasjonene bor. Bruk `*` for alle, eller `todo-3` for én bestemt.
- Et element som bare finnes **etter** navigasjonen har bare `::view-transition-new` — det er din
  «ny todo»-animasjon. Et som forsvinner har bare `::view-transition-old`.
- `view-transition-name` må være unikt per side. Derfor er id-en med i navnet.
- 🛠️ DevTools → Animations lar deg sakke ned avspillingen.

📖 [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) ·
[MDN: `@view-transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

🔑 `:only-child` treffer tilfellene der bare **én** av gammel/ny finnes — altså elementer som
kommer til eller forsvinner. Todos som finnes i begge tilstander får den innebygde
morph-animasjonen, som er akkurat det vi vil ha når en todo bare flytter på seg.

Prøv også `view-transition-class` hvis du vil gruppere flere navn under én regel.

</details>

---

### 4️⃣ Nye todos glir inn med `@starting-style`

View transitions dekker navigasjoner. `@starting-style` dekker det mer generelle tilfellet: hva
skal et element animere **fra** når det dukker opp for første gang?

**🎯 Oppgave:** Animer nye todos inn i lista.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- Et element som nettopp er lagt til i DOM-en har ingen «forrige» verdi å transitionere fra —
  `@starting-style` gir den.
- Formen er: sluttilstanden på selektoren, starttilstanden i `@starting-style { .todo { … } }`.
- Du trenger en `transition` på elementet for at det skal skje noe.
- For elementer som forsvinner trenger du `transition-behavior: allow-discrete` — `display` kan
  ikke transitionere uten.

📖 [MDN: `@starting-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) ·
[MDN: `transition-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

⚠️ Dette og view transitions kan komme i veien for hverandre. Diskuter: når er `@starting-style`
riktig verktøy, og når er view transitions det?

</details>

---

### 5️⃣ Slettedialogen med `<dialog>` og popover

Slettebekreftelsen bruker allerede `<dialog>` og **invoker commands**
(`command="show-modal" commandfor="…"`) — helt uten JavaScript. Den ser bare ikke spesielt bra ut
ennå.

**🎯 Oppgave:** Style dialogen, inkludert backdrop og åpne-/lukke-animasjon. Utforsk deretter
popover som alternativ.

> 📂 **To rariteter du vil møte når du åpner og lukker todos her** — begge med vilje:
>
> - **Bare én todo kan stå åpen om gangen.** Alle `<details>` deler `name="example"`, som gjør
>   dem til en eksklusiv accordion. Fjern attributtet i `views/index.ejs` hvis det er i veien
>   mens du jobber.
> - **Klikk på checkboxen åpner også todoen.** Checkboxen ligger inne i `<summary>`, så klikket
>   treffer begge. Et ekte utslag av at vi presser HTML-elementer litt utenfor komfortsonen.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `dialog::backdrop` styles som et vanlig element: `background`, `backdrop-filter`, animasjoner.
- `dialog:open` (eller `dialog[open]`) er tilstanden når den er åpen — kombiner med
  `@starting-style` fra forrige steg.
- For å animere **lukking** trenger du `transition-behavior: allow-discrete` på `display` og
  `overlay`.
- Popover-varianten: `<button popovertarget="…">` + `<div popover>`. Lettere enn dialog, men ikke
  modal og fanger ikke fokus.
- `command`/`commandfor` er den deklarative måten å styre begge på — `show-modal`, `close`,
  `toggle-popover`.

📖 [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) ·
[MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) ·
[MDN: `command`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#command)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

---

### 6️⃣ Tooltip på plass med anchor positioning

**🎯 Oppgave:** Posisjoner en tooltip eller popover relativt til en bestemt todo — uten
JavaScript-basert posisjonsberegning.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- Ankeret får `anchor-name: --et-navn`, elementet som skal posisjoneres får
  `position-anchor: --et-navn` og `position: absolute`.
- `position-area: bottom center` er en enkel snarvei for de vanlige plasseringene.
- 🪄 `position-try-fallbacks: flip-block, flip-inline` gjør at tooltipen snur når den ikke får
  plass — det er akkurat dette man ellers drar inn Floating UI for.
- Et popover-element ligger i top layer, og anchor positioning er laget for nettopp den
  kombinasjonen.
- ⚠️ Ankernavn må være unike per element, så du trenger ett per todo. Hvordan får du en
  CSS-regel til å bruke **ulik** verdi per element?

📖 [MDN: CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) ·
[MDN: `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

Ankernavnet må være unikt per todo, så det må skrives ut fra serveren — akkurat som
`view-transition-name` allerede gjøres. I `views/index.ejs`, inne i `<details>`:

```html
<button popovertarget="info-<%= todo.id %>">Info</button>

<div id="info-<%= todo.id %>" popover
     style="--anchor: --todo-<%= todo.id %>">
    Opprettet som todo nummer <%= todo.id %>.
</div>
```

Og sett ankeret på `<li>`-en, som allerede har en id-basert style-attributt:

```html
<li class="todo" style="view-transition-name: todo-<%= todo.id %>; anchor-name: --todo-<%= todo.id %>">
```

I CSS:

```css
.todo [popover] {
  position: absolute;
  position-anchor: var(--anchor);
  position-area: bottom span-right;
  margin: 0.5rem 0 0;
  position-try-fallbacks: flip-block, flip-inline;
  border: 1px solid lightgray;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}
```

🔑 Trikset er at `position-anchor` leser en custom property, slik at CSS-regelen kan være felles
mens **verdien** kommer per element.

Prøv å scrolle så popoveren ikke får plass under todoen — `position-try-fallbacks` snur den over
av seg selv.

</details>

---

### 7️⃣ Filtrering uten en eneste linje JS

**🎯 Oppgave:** Legg til filtrering — alle / aktive / fullførte — med radioknapper. Ingen
server-runde, ingen JavaScript.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- Tre `<input type="radio" name="filter">` med hver sin `<label for="…">`, plassert over
  todo-lista.
- Nøkkelen er å la `:has()` gjøre jobben fra toppen av dokumentet:
  `body:has(#filter-active:checked) .todo:has(input:checked) { display: none; }`
- ⚠️ Fristende alternativ: søskenkombinatoren `~`. Den krever at radioknappene og `<ul>` har
  **samme forelder** — pakker du radioknappene i en `<fieldset>`, slutter den å virke.
  `body:has(…)` slipper unna hele problemet.

📖 [MDN: `:checked`](https://developer.mozilla.org/en-US/docs/Web/CSS/:checked) ·
[MDN: Subsequent-sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

I `views/index.ejs`, rett før `<ul class="todos">`:

```html
<div class="filters">
    <input type="radio" id="filter-all" name="filter" checked />
    <label for="filter-all">Alle</label>

    <input type="radio" id="filter-active" name="filter" />
    <label for="filter-active">Aktive</label>

    <input type="radio" id="filter-done" name="filter" />
    <label for="filter-done">Fullførte</label>
</div>
```

I CSS:

```css
body:has(#filter-active:checked) .todo:has(input[type="checkbox"]:checked) {
  display: none;
}

body:has(#filter-done:checked) .todo:not(:has(input[type="checkbox"]:checked)) {
  display: none;
}
```

🔑 `:has()` brukes to ganger i samme selektor, på to helt ulike nivåer: én gang for å lese
filtervalget fra toppen av dokumentet, én gang for å lese tilstanden til den enkelte todoen.

🤔 **Legg merke til telleren fra holdeplass 2 når du filtrerer** — den følger filteret. Skjuler du
de aktive todoene, viser den plutselig «0 gjenstår».

Det er ikke en bug. `display: none` fjerner elementet fra box-treet helt, og `counter-increment`
kjører bare på elementer som faktisk genererer en boks. Filtrering og telling henger sammen enten
du vil eller ikke.

Er det ønsket oppførsel? Diskuter — og hvis svaret er nei: hva kan du bruke i stedet for
`display: none`?

</details>

---

### 8️⃣ Scroll-effekter

**🎯 Oppgave:** Animer elementer basert på scroll-posisjon. Legg inn nok todos til at siden
faktisk scroller først.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- To tidslinjer: `scroll()` (hvor langt containeren har kommet) og `view()` (hvor elementet er i
  viewporten).
- `animation-timeline: view();` + `animation-range: entry 0% cover 30%;` gir den klassiske «fade
  inn når den kommer til syne»-effekten.
- 📊 Fremdriftsindikator på toppen: et fast posisjonert element med
  `animation-timeline: scroll(root block);` og `scaleX` fra 0 til 1.
- Animasjonen må ha `animation-name` og `animation-duration: auto` — varigheten styres av
  tidslinjen, ikke av klokka.
- ♿ Pakk inn i `@supports (animation-timeline: view())` og respekter `prefers-reduced-motion`.
- ⚠️ `animation: … both` låser `opacity` og `transform` på `.todo` og overstyrer transitionen fra
  holdeplass 4. Ikke en bug — det er kaskaden. Enten dropper du den effekten her, eller så flytter
  du scroll-animasjonen til et innerelement.

📖 [MDN: Scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) ·
[scroll-driven-animations.style](https://scroll-driven-animations.style/)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

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

---

## 🏁 Endestasjon

Hvor langt kom vi? Gå gjennom i gruppa:

- 🤔 Hva føltes naturlig i CSS, og hva føltes som et triks som ikke hører hjemme der?
- 🚧 Hvor gikk grensen — hva krevde faktisk JavaScript?
- 🚢 Hvilke av disse ville du tatt i bruk i produksjon i morgen?

### 💬 Hva koster den siste linjen JavaScript?

Husker du Toggle-knappen som irriterte deg helt i starten? Den finnes fordi en checkbox ikke kan
sende et skjema av seg selv. Den åpenbare løsningen er én linje JavaScript:

```html
<input type="checkbox" onchange="this.form.submit()" />
```

Da oppfører checkboxen seg nøyaktig som folk forventer: huk av, ferdig. Ingen ekstra knapp.

Vi har valgt den bort, og prisen er en «Toggle»-knapp ved siden av hver eneste checkbox.
Funksjonelt likeverdig, merkbart klumpete.

> 🗣️ **Ingenting å implementere her** — bare ta diskusjonen:
>
> - Er «null JavaScript» et mål i seg selv, eller et middel?
> - Hvor mye UX er du villig til å ofre for å slippe den linjen?
> - Er en inline `onchange` noe annet enn å dra inn et rammeverk? Hvor går forskjellen?
> - Finnes det en tredje vei som er bedre enn begge?

### 🔜 Der HTML og CSS faktisk tar slutt

Ett konkret svar på spørsmålet om hvor grensen går: **live oppdatering på tvers av klienter.**
Åpne appen i to faner og legg til en todo i den ene — den andre vet ingenting før du refresher.
Alt annet i denne appen klarer seg uten JavaScript. Det gjør ikke dette.

> Her må serveren kunne dytte endringer ut til klientene, og klienten må kunne ta imot dem.
> Server-sent events og htmx løser det med veldig lite kode — **og det er tema for neste
> workshop.**

---

## 🗺️ Kart over prosjektet

```
package.json
server.js         🚂 Express-server, fire ruter, ingenting mer
views/index.ejs   📄 Hele HTML-en
public/index.css  🎨 Grunnstyling — og der du jobber
todos.json        💾 "Databasen". Slett den for å nullstille.
CLAUDE.md         🤖 Spilleregler for Claude Code i dette repoet
```

Todo-modellen er `{ id, description, completed }`:

| Rute | Hva den gjør |
| --- | --- |
| `GET /` | Rendrer alle todos |
| `POST /todo` | Oppretter ny todo → redirect `/` |
| `POST /todo/:id/toggle` | Toggler `completed` → redirect `/` |
| `POST /todo/:id/delete` | Sletter todo → redirect `/` |

> 💡 **To detaljer er alt du trenger for å komme langt:** hver `<li>` har
> `view-transition-name: todo-<id>`, og checkboxen speiler `completed` fra serveren.

---

## 📚 Ressurser

- 📖 [MDN: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- 🧭 [web.dev: Baseline](https://web.dev/baseline)
- 📊 [Can I use](https://caniuse.com/)
- 📰 [Chrome for Developers](https://developer.chrome.com/blog)
