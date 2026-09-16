# 🚋 Rutine

> **Gjøremål på skinner.** En workshop om hvor langt moderne HTML og CSS tar deg — uten en
> eneste linje JavaScript i nettleseren.

---

## 🎯 Hva handler dette om?

Webplattformen har utviklet seg enormt de siste årene. Ting vi før dro inn rammeverk, biblioteker
og hauger av JavaScript for, er nå innebygd i nettleseren: `:has()`, view transitions,
`@starting-style`, anchor positioning, popover og scroll-drevne animasjoner.

**Spørsmålet vi skal svare på:** hvor langt kommer vi med kun HTML og CSS?

Vi finner det ut ved å bygge en todo-app. Serveren er ferdig og med vilje kjedelig: Express, EJS
og en JSON-fil. Den har fire ruter som venter på deg. **HTML-en og CSS-en bygger du selv** — først
appen, så alt som gjør den fin.

> 🚫 **Én regel:** ingen JavaScript i nettleseren. Ingen htmx, ingen Alpine, ingen `onclick`.
> Ingenting.

---

## 🚀 Kom i gang

> ⚠️ **Bruk Chrome 135+.** Det er den eneste nettleseren der hele workshopen virker.
>
> Firefox mangler to av tingene vi skal leke med: **cross-document view transitions**
> (holdeplass 6) og **scroll-drevne animasjoner** (et [🛤️ Sidespor](#-sidespor)). Begge feiler
> stille — siden fungerer, men du ser ingen effekt og tror du har gjort feil. Safari 26+ skal ha
> begge, men er ikke testet her.
>
> Uansett nettleser: den må være ny. `command`/`commandfor` er ferskt, og på en eldre nettleser
> skjer det rett og slett ingenting når du trykker Slett — da faller holdeplass 3 sammen.

```bash
git clone git@github.com:sveinpg/entur-faggruppe-moderne-web-html.git
cd entur-faggruppe-moderne-web-html
npm install
npm start
```

👉 Appen kjører på **<http://localhost:3000>**

Du kommer til å jobbe i to filer: **`views/index.ejs`** i etappe 1, og **`public/index.css`** i
etappe 2. `npm start` bruker nodemon, så serveren restarter når du endrer filer — CSS-endringer
trenger bare en refresh.

---

## 🛤️ Ruta

Workshopen går i to etapper. **Første etappe bygger appen med HTML** — uten den har du ingenting
å style. **Andre etappe gjør den levende med CSS.**

**🧱 Etappe 1 — bygg appen**

| | Holdeplass | Tema |
| --- | --- | --- |
| 1 | [Skjemaet som oppretter todos](#holdeplass-1-skjemaet-som-oppretter-todos) | 📝 `<form method="POST">` |
| 2 | [Huk av en todo](#holdeplass-2-huk-av-en-todo) | ☑️ Boolske attributter |
| 3 | [Slett med bekreftelse](#holdeplass-3-slett-med-bekreftelse) | 💬 `<dialog>` & invoker commands |

**🎨 Etappe 2 — gjør den levende**

| | Holdeplass | Tema |
| --- | --- | --- |
| 4 | [Gjennomstreking](#holdeplass-4-gjennomstreking-med-has) | 🔍 `:has()` |
| 5 | [Antall gjenstående](#holdeplass-5-antall-gjenstående-med-css-counters) | 🔢 CSS counters |
| 6 | [Sideoverganger](#holdeplass-6-sideoverganger-med-view-transitions) | 🎞️ View Transitions |
| 7 | [Nye todos glir inn](#holdeplass-7-nye-todos-glir-inn-med-starting-style) | ✨ `@starting-style` |
| 8 | [Style dialogen](#holdeplass-8-style-dialogen-du-bygde) | 💅 `::backdrop` & popover |
| 9 | [Tooltip på plass](#holdeplass-9-tooltip-på-plass-med-anchor-positioning) | 📌 Anchor positioning |
| 10 | [Filtrering](#holdeplass-10-filtrering-uten-en-eneste-linje-js) | 🔍 `:has()` igjen |

**Etappe 1 er obligatorisk** — den tar ikke lang tid, og resten bygger på den. I etappe 2 er
**hele 4–10 hovedruta.** Holdeplass 9 er kort, og den inneholder det tydeligste eksempelet i hele
workshopen på en avhengighet du kan slette — den er verdt å rekke.

Utenom ruta ligger [🛤️ Sidespor](#-sidespor): frivillige omveier for deg som blir tidlig ferdig
eller vil grave dypere i noe du nettopp bygget.

Hvert steg har 💡 **Hint** og ✅ **Løsningsforslag** i utslåbare blokker. Løsningsforslaget er
*et* forslag — ikke fasit.

> 🧭 **Falt du av, eller vil du bare se fasiten kjøre?** Hver holdeplass har sin egen branch med
> appen ferdig bygget til og med det steget:
>
> ```bash
> git switch losning/holdeplass-03   # appen etter holdeplass 3
> git switch main                    # tilbake til din egen kode
> ```
>
> `losning/holdeplass-01` til `losning/holdeplass-10` følger holdeplassene. `losning/holdeplass-11`
> er hele appen ferdig, inkludert scroll-sidesporet. Husk å committe eller stashe ditt eget
> arbeid før du bytter.
>
> Branchene inneholder **bare koden** — denne guiden ligger på `main`. Trenger du den mens du
> står på en løsningsbranch, les den [på GitHub](https://github.com/sveinpg/entur-faggruppe-moderne-web-html#readme)
> eller kjør `git show main:README.md`.

> 🤖 **Bruker du Claude Code?** Repoet har en `CLAUDE.md` som ber Claude om å diskutere, stille
> spørsmål og finne dokumentasjon — men aldri skrive koden for deg. Det er med vilje: hele
> poenget er at koden skal gjennom fingrene dine.

---

## 🧱 Etappe 1 — bygg appen

Serveren er ferdig og venter. Den har fire ruter, og alle er allerede koblet opp:

| Rute | Hva den gjør |
| --- | --- |
| `GET /` | Rendrer alle todos |
| `POST /todo` | Oppretter ny todo → redirect `/` |
| `POST /todo/:id/toggle` | Toggler `completed` → redirect `/` |
| `POST /todo/:id/delete` | Sletter todo → redirect `/` |

Det som mangler er HTML-en som snakker med dem. I `views/index.ejs` står det tre kommentarer der
markupen skal inn — én per holdeplass i denne etappen.

> 💡 **Har du ikke sett EJS før?**
>
> Det er en **templatemotor**: en HTML-fil med hull i, som serveren fyller ut før siden sendes.
> Ingen bygging, ingen kompilering — serveren leser fila på hver forespørsel. `views/index.ejs`
> er vanlig HTML bortsett fra to tagger:
>
> - `<%= verdi %>` skriver ut en verdi. Den escaper også innholdet, så en todo som heter
>   `<script>` blir stående som tekst.
> - `<% kode %>` kjører JavaScript **på serveren** — som løkka rundt todoene. Den er allerede
>   skrevet for deg, og den er den eneste du trenger.
>
> Du trenger ikke lære EJS for å gjøre denne workshopen. Du skriver HTML, og setter inn
> `<%= todo.id %>` der en id skal stå.

---

### Holdeplass 1: Skjemaet som oppretter todos

Appen har to eksempel-todos, men ingen måte å lage flere på.

**🎯 Oppgave:** Bygg skjemaet som oppretter en ny todo. Ingen `fetch`, ingen event listeners — et
skjema som poster.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `<form method="POST" action="/todo">` sender skjemaet dit serveren lytter.
- Serveren leser feltet som `req.body.description` — se `server.js`. Da må `name`-attributtet på
  input-en hete nøyaktig det samme. Dette er hele kontrakten mellom HTML og server.
- Gi `class="new-todo"` på skjemaet, så treffer grunnstylingen som allerede ligger i CSS-en.
- `required` gir deg validering uten en eneste linje kode, og `autocomplete="off"` holder
  nettleserens forslag unna.
- 🤔 Fristende å legge på `autofocus` også, så markøren står klar i feltet. Ikke gjør det ennå —
  den har en bieffekt du får se på [🏁 Endestasjon](#-endestasjon).
- Serveren svarer med en redirect tilbake til `/`. Mønsteret heter **POST/Redirect/GET**, og det
  er grunnen til at du kan refreshe etterpå uten å få «vil du sende inn på nytt?».

📖 [MDN: `<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ·
[MDN: Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) ·
[MDN: POST/Redirect/GET](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

I `views/index.ejs`, der den første kommentaren står:

```html
<form method="POST" action="/todo" class="new-todo">
    <input placeholder="Ny todo" name="description" autocomplete="off" required />
    <button type="submit">Legg til</button>
</form>
```

🔑 **Poenget:** hele dataflyten — tekst inn, lagret på server, ny side rendret — uten at du har
skrevet JavaScript. Dette er hvordan web fungerte lenge før `fetch`, og det virker fortsatt.

</details>

---

### Holdeplass 2: Huk av en todo

Todoene vises, men du kan ikke krysse dem av.

**🎯 Oppgave:** Gi hver todo et skjema som poster til `/todo/<id>/toggle`, med en checkbox som
viser om den er fullført.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- Hver todo trenger sitt **eget** skjema — du kan ikke ha ett skjema rundt hele lista, for da
  vet ikke serveren hvilken todo du mener. Skjemaer kan heller ikke ligge inni hverandre.
- Id-en må inn i `action`. Løkka gir deg `todo.id`, som du skriver ut med `<%= todo.id %>`.
- `checked` er en **boolsk attributt**: den er enten til stede eller ikke. `checked="false"`
  slår den *på*. Så du må skrive den ut betinget.
- Gi `class="toggle-form"`, så treffer grunnstylingen.
- ⚠️ En checkbox kan ikke sende et skjema av seg selv. Du trenger en knapp i tillegg.

📖 [MDN: `<input type="checkbox">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox) ·
[MDN: Boolean attributes](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

```html
<form method="POST" action="/todo/<%= todo.id %>/toggle" class="toggle-form">
    <input name="checked" type="checkbox" <%= todo.completed ? "checked" : "" %> />
    <button type="submit">Toggle</button>
</form>
```

Ternaryen er ikke elegant, men det finnes ikke noe alternativ: en boolsk attributt må enten
skrives ut eller utelates helt.

> 🗣️ **Toggle-knappen kommer til å irritere deg.** Du huker av, og ingenting skjer før du trykker
> knappen. Det er ikke en bug — det er prisen for regelen om null JavaScript. Én linje
> `onchange="this.form.submit()"` ville fjernet knappen.
>
> Legg merke til en ting til når du kommer til holdeplass 4: checkboxen og serveren vet ikke om
> hverandre. Ruta leser aldri feltet — den bare flipper `completed`. Hva betyr det for en bruker
> som huker av og går videre uten å trykke? Den diskusjonen tar vi på
> [🏁 Endestasjon](#-endestasjon).

</details>

---

### Holdeplass 3: Slett med bekreftelse

Nå mangler bare sletting — og en «er du sikker?» før den går.

**🎯 Oppgave:** Bygg en Delete-knapp som åpner en modal, og la modalen inneholde skjemaet som
faktisk sletter. Fortsatt null JavaScript.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `<dialog>` er et ekte modal-element i HTML. Det håndterer backdrop, fokusfelle og Escape helt
  på egen hånd.
- Du åpner og lukker den med **invoker commands**: en knapp med `command="show-modal"` og
  `commandfor="<id-en til dialogen>"`. For å lukke: `command="close"`.
- ⚠️ Hver todo får sin egen dialog, så id-ene må være unike. Bak dem med `todo.id`.
- Knappen som avbryter må ha `type="button"` — ellers sender den skjemaet, som er det motsatte
  av å avbryte.
- Skjemaet som sletter kan ligge **inne i** dialogen. Gi knapperaden `class="dialog-actions"`.

📖 [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) ·
[MDN: `command`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#command) ·
[MDN: `commandfor`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#commandfor)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

```html
<button command="show-modal" commandfor="confirm-delete-<%= todo.id %>">Slett</button>

<dialog id="confirm-delete-<%= todo.id %>">
    <h2>Er du sikker?</h2>

    <form method="POST" action="/todo/<%= todo.id %>/delete">
        <p>Denne todoen blir borte for godt.</p>

        <div class="dialog-actions">
            <button type="button" command="close" commandfor="confirm-delete-<%= todo.id %>">Avbryt</button>
            <button type="submit">Slett</button>
        </div>
    </form>
</dialog>
```

🔑 **Poenget:** en modal med backdrop, fokushåndtering, Escape-lukking og en destruktiv handling
bak bekreftelse — null JavaScript. For få år siden var dette et bibliotek.

🎁 **Bonus:** vil du gjemme Delete-knappen til man ber om den, pakk den i en `<details>` med en
`<summary>`. Enda et HTML-element som gjør en JS-jobb.

</details>

---

## 🎨 Etappe 2 — gjør den levende

Appen virker. Nå skal den bli fin — og alt som følger skjer i `public/index.css`.

---

### Holdeplass 4: Gjennomstreking med `:has()`

Den enkle måten er å la serveren sende med en `completed`-klasse, eller en inline
`text-decoration: line-through`, på hver fullførte todo. Men det er unødvendig arbeid:
nettleseren vet allerede om checkboxen er huket av.

**🎯 Oppgave:** Stryk over teksten til fullførte todos med CSS alene. Ingen ekstra klasser fra
serveren.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `:has()` er en **parent selector**: `.todo:has(input:checked)` matcher en todo som *inneholder*
  en avhuket checkbox.
- ⚠️ Fristende alternativ: `input:checked ~ .description`. Men `~` treffer bare **søsken**, og
  checkboxen ligger inne i toggle-skjemaet mens teksten ligger utenfor. `:has()` bryr seg ikke
  om det.
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
```

🔑 **Poenget:** tilstanden bor i DOM-en, ikke i en klasse serveren måtte regne ut.

</details>

---

### Holdeplass 5: Antall gjenstående med CSS counters

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

🎁 **Bonus:** to tellere samtidig gir deg «3 av 7 fullført» — se
[🛤️ Sidespor](#-sidespor).

</details>

---

### Holdeplass 6: Sideoverganger med View Transitions

`public/index.css` inneholder allerede:

```css
@view-transition {
  navigation: auto;
}
```

Det gjør at hver navigasjon — også form-posten og redirecten etterpå — animeres i stedet for å
blinke. ⚠️ **Dette er en av de to holdeplassene som ikke virker i Firefox** — regelen blir
ignorert der. Bruk Chrome. Hver `<li>` har `view-transition-name: todo-<id>`, så nettleseren kan matche samme todo
på tvers av sidelastninger.

**🎯 Oppgave:** Utforsk hva som allerede skjer, og tilpass animasjonene. Gi nye og slettede todos
ulik overgang.

Tre ting å gjøre før du skriver en eneste regel:

1. **Legg inn åtte-ti todos.** Med tre-fire ser du nesten ingenting av det som følger.
2. **Slå av `@view-transition`-regelen i `public/index.css`, legg til en todo, og slå den på
   igjen.** Forskjellen du ser der er nøyaktig hva denne holdeplassen handler om — og mindre enn
   du tror, for nettleseren gjør allerede en del av jobben på egen hånd.
3. **Slett en todo fra midten av lista** og se på radene under. De glir oppover i stedet for å
   hoppe. Ingen har bedt om den animasjonen; den følger av at hver `<li>` har et unikt
   `view-transition-name`, så nettleseren kjenner igjen samme todo i to forskjellige dokumenter.

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
- ⚠️ Får du `AbortError: Transition was skipped` i konsollen, er navnene som regel ikke unike.
  To elementer med samme `view-transition-name` gjør at hele overgangen droppes — sjekk at
  `<%= todo.id %>` faktisk er med i navnet.
- ⚠️ Refresh utløser **ingen** overgang. `navigation: auto` gjelder ikke reload, adresselinja
  eller bokmerker. Bruk skjemaene i appen når du tester.

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

Vil du gruppere flere navn under én regel, ligger `view-transition-class` på
[🛤️ Sidespor](#-sidespor).

</details>

---

### Holdeplass 7: Nye todos glir inn med `@starting-style`

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

⚠️ Dette og view transitions kan komme i veien for hverandre. Verdt å tenke over: når er
`@starting-style` riktig verktøy, og når er view transitions det?

</details>

---

### Holdeplass 8: Style dialogen du bygde

Dialogen du bygde i [holdeplass 3](#holdeplass-3-slett-med-bekreftelse) virker, men ser ut som
en dialog fra 2011. Nettleseren gir deg backdrop, fokushåndtering og Escape gratis — resten er
din.

**🎯 Oppgave:** Style dialogen, inkludert backdrop og åpne-/lukke-animasjon. Utforsk deretter
popover som alternativ.

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

Popover-varianten i HTML — den bruker du igjen på holdeplass 9:

```html
<button popovertarget="info-1">Info</button>
<div id="info-1" popover>Opprettet <%= created(todo) %>.</div>
```

</details>

---

### Holdeplass 9: Tooltip på plass med anchor positioning

**🎯 Oppgave:** Posisjoner en tooltip eller popover relativt til en bestemt todo — uten
JavaScript-basert posisjonsberegning.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- 🎁 Du får ankeret gratis: en popover som åpnes med `popovertarget` har allerede knappen som
  åpnet den som **implisitt anker**. Ingen `anchor-name`, ingen `position-anchor`.
- `position-area: bottom center` er en enkel snarvei for de vanlige plasseringene.
- 🪄 `position-try-fallbacks: flip-block, flip-inline` gjør at tooltipen snur når den ikke får
  plass — det er akkurat dette man ellers drar inn Floating UI for.
- ⚠️ En popover er allerede `position: fixed` med `margin: auto` fra nettleseren. Den margin-en
  må du nulle ut, ellers dytter den seg selv bort fra ankeret.

📖 [MDN: CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) ·
[MDN: `position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/position-area)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

Markupen er den samme som på holdeplass 8 — ingenting nytt trengs:

```html
<button popovertarget="info-<%= todo.id %>">Info</button>

<div id="info-<%= todo.id %>" popover>
    Opprettet <%= created(todo) %>.
</div>
```

`created` er en liten hjelper serveren sender med til malen — den formaterer `todo.createdAt`
til lesbar norsk dato. Se `server.js`.

Hele jobben gjøres i CSS:

```css
.todo [popover] {
  position-area: bottom span-right;
  position-try-fallbacks: flip-block, flip-inline;
  margin: 0.4rem;
  border: 1px solid lightgray;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}
```

🔑 **Poenget:** ingen koordinater, ingen `anchor-name`, ingen JavaScript. `popovertarget` knytter
knappen og popoveren sammen, og den koblingen er *også* ankerreferansen. Én regel dekker alle
todos, fordi hver popover peker på sin egen knapp helt av seg selv.

Prøv å scrolle så popoveren ikke får plass under knappen — `position-try-fallbacks` snur den over
av seg selv. Det er den funksjonen folk ellers installerer et bibliotek for.

> 🛤️ **Vil du ankre til noe annet enn knappen** — hele raden, for eksempel — må du navngi ankeret
> selv, og da støter du på at navn må være unike per todo. Den varianten ligger på
> [🛤️ Sidespor](#-sidespor).

</details>

---

### Holdeplass 10: Filtrering uten en eneste linje JS

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

🤔 **Legg merke til telleren fra holdeplass 5 når du filtrerer** — den følger filteret. Skjuler du
de aktive todoene, viser den plutselig «0 gjenstår».

Det er ikke en bug. `display: none` fjerner elementet fra box-treet helt, og `counter-increment`
kjører bare på elementer som faktisk genererer en boks. Filtrering og telling henger sammen enten
du vil eller ikke.

Er det ønsket oppførsel? Og hvis svaret er nei: hva kan du bruke i stedet for `display: none`?
Det spørsmålet har fått sitt eget [🛤️ Sidespor](#-sidespor).

</details>

---

## 🛤️ Sidespor

Omveier som ikke ligger på ruta. De er her for deg som blir tidlig ferdig, eller som vil grave i
noe spesielt — ta dem i hvilken rekkefølge du vil, og hopp over resten uten dårlig samvittighet.

Hvert sidespor sier hva det bygger på, hva det lærer bort, og omtrent hvor lenge det tar.

---

### 📜 Scroll-drevne animasjoner

> **Bygger på:** hele appen · **Lærer bort:** animasjon styrt av scroll i stedet for av klokka ·
> **Tid:** ~25 min · **Kun Chrome**

To tidslinjer som ikke finnes i vanlig CSS: `scroll()` følger hvor langt en container har kommet,
`view()` følger hvor et element er i viewporten. Med dem kan du animere uten en eneste
millisekundverdi — varigheten er scrollen.

⚠️ **Tre ting som gjør at du tror det ikke virker:**

1. **Du trenger mange todos.** Tjue eller flere. Scroller ikke siden, finnes det ingen tidslinje.
2. **Firefox støtter det ikke.** `@supports`-guarden gjør at siden fungerer — du ser bare
   ingenting. Bytt til Chrome.
3. **`entry`-området er kortere enn du tror.** `entry 0% entry 60%` er ferdig etter at elementet
   så vidt har kommet inn, altså over én radhøyde med scrolling. På en 60 piksler høy rad rekker
   du ikke å se det. Prøv `entry 0% cover 30%` i stedet — da varer det lenge nok til å merkes.

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- `animation-timeline: view();` kobler animasjonen til elementets ferd gjennom viewporten.
- `animation-range` bestemmer *hvilken del* av den ferden som animeres.
- 📊 Fremdriftsindikator: et fast posisjonert element med `animation-timeline: scroll(root block);`
  som går fra `scaleX(0)` til `scaleX(1)`.
- ♿ Pakk inn i `@supports (animation-timeline: view())`, og skru av under
  `prefers-reduced-motion`. Husk at indikatoren også er en animasjon.

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
  .todo .description {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
}
```

⚠️ **Animasjonen ligger på `.description`, ikke på `.todo`.** `both` beholder animasjonens verdier
også utenfor den aktive perioden, og animasjoner slår transitions i kaskaden. Legger du den på
`.todo`, låser du `opacity` og `translate` der — og innglidningen fra holdeplass 7 slutter å
virke.

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

Og til slutt, for dem som har bedt om mindre bevegelse:

```css
@media (prefers-reduced-motion: reduce) {
  .todo .description,
  body::before { animation: none; }
}
```

Koden ligger ferdig på branchen `losning/holdeplass-11`.

</details>

---

### 🧭 Ulikt anker per element

> **Bygger på:** holdeplass 9 · **Lærer bort:** hvordan én CSS-regel får ulik verdi per element ·
> **Tid:** ~20 min

På holdeplass 9 slapp du unna med det implisitte ankeret: popoveren peker på knappen som åpnet
den, helt gratis. Men hva om du vil ankre til noe annet — hele raden, for eksempel, så tooltipen
legger seg under todoen i stedet for under knappen?

Da må du navngi ankeret selv med `anchor-name`, og der møter du veggen: **ankernavn må være
unike per element.** Du har én CSS-regel og mange todos. Hvordan får du regelen til å bruke en
ulik verdi for hver?

<details>
<summary>💡 <b>Hint</b></summary>

<br>

- Serveren kan skrive ut hva som helst per element — den gjør det allerede med
  `view-transition-name` på `<li>`-en.
- CSS-regelen må være felles, men **verdien** kan komme utenfra. Hva i CSS er laget for nettopp
  det å bære en verdi som settes et annet sted?
- `position-anchor` tar en verdi. Den verdien trenger ikke stå skrevet i regelen.

📖 [MDN: `anchor-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name) ·
[MDN: Custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)

</details>

<details>
<summary>✅ <b>Løsningsforslag</b></summary>

<br>

Sett ankernavnet på `<li>`-en, som allerede har en id-basert style-attributt:

```html
<li class="todo" style="view-transition-name: todo-<%= todo.id %>; anchor-name: --todo-<%= todo.id %>">
```

Og la popoveren bære sitt eget ankernavn som en custom property:

```html
<div id="info-<%= todo.id %>" popover style="--anchor: --todo-<%= todo.id %>">
    Opprettet <%= created(todo) %>.
</div>
```

```css
.todo [popover] {
  position: absolute;
  position-anchor: var(--anchor);
  position-area: bottom span-right;
}
```

🔑 Trikset er at `position-anchor` leser en custom property, slik at regelen kan være felles mens
verdien kommer per element. Samme mønster løser alt som må være unikt per element i CSS.

</details>

---

### 🔢 «X av Y fullført»

> **Bygger på:** holdeplass 5 · **Lærer bort:** flere tellere samtidig · **Tid:** ~10 min

Telleren din viser hvor mange som gjenstår. Utvid til «3 av 7 fullført» — det krever to tellere
som teller ulike ting i samme liste. Nummerer gjerne todoene med en tredje mens du er i gang.

📖 [MDN: Using CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)

---

### 🎞️ Grupper overganger med `view-transition-class`

> **Bygger på:** holdeplass 6 · **Lærer bort:** å style mange transition-navn under én regel ·
> **Tid:** ~10 min

På holdeplass 6 traff du alle overgangene med `*`, eller én bestemt med navnet sitt. Midt imellom
ligger `view-transition-class`: gi flere elementer samme klasse, og style dem som gruppe. Prøv å
gi fullførte og aktive todos hver sin overgang.

📖 [MDN: `view-transition-class`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-class)

---

### 💬 Popover eller dialog?

> **Bygger på:** holdeplass 3 og 8 · **Lærer bort:** når modal er riktig, og når det er i veien ·
> **Tid:** ~15 min

Du har begge i appen nå: en `<dialog>` for sletting og en popover for info. De ser like ut, men
oppfører seg helt ulikt. Undersøk forskjellen med tastaturet — tab deg rundt mens hver av dem er
åpen, og trykk Escape.

Spørsmål å ta med videre: hvorfor fanger dialogen fokus, mens popoveren ikke gjør det? Hvilken av
dem er riktig for en bekreftelse du *må* svare på? Og hva skjer med resten av siden når et element
løftes til top layer?

📖 [MDN: `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) ·
[MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) ·
[MDN: Top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)

---

### 🔍 Telleren som forsvinner

> **Bygger på:** holdeplass 5 og 10 · **Lærer bort:** hva `display: none` egentlig gjør ·
> **Tid:** ~15 min, mest diskusjon

Filtrerer du bort de aktive todoene, sier telleren plutselig «0 gjenstår». Det er ikke en bug:
`display: none` fjerner elementet fra box-treet, og `counter-increment` kjører bare på elementer
som faktisk genererer en boks.

Finn ut hva som skjer hvis du skjuler radene på andre måter i stedet. Teller de fortsatt? Tar de
fortsatt plass? Det finnes ikke ett riktig svar her — poenget er at «skjult» betyr flere
forskjellige ting i CSS, og at du må velge hvilken du mener.

📖 [MDN: `display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) ·
[MDN: `visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/visibility) ·
[MDN: `content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

---

## 🏁 Endestasjon

Hvor langt kom vi? Tre spørsmål å ta stilling til — alene eller høyt, alt etter hvordan du
kjører workshopen:

- 🤔 Hva føltes naturlig i CSS, og hva føltes som et triks som ikke hører hjemme der?
- 🚧 Hvor gikk grensen — hva krevde faktisk JavaScript?
- 🚢 Hvilke av disse ville du tatt i bruk i produksjon i morgen?

### 💬 Hva koster den siste linjen JavaScript?

Husker du Toggle-knappen du bygde i holdeplass 2? Den finnes fordi en checkbox ikke kan sende et
skjema av seg selv. Den åpenbare løsningen er én linje JavaScript:

```html
<input type="checkbox" onchange="this.form.submit()" />
```

Da oppfører checkboxen seg nøyaktig som folk forventer: huk av, ferdig. Ingen ekstra knapp.

Vi har valgt den bort. Prisen ser ut som en ekstra knapp — men den er høyere enn som så.

**Checkboxen kan lyve.** Den er ikke koblet til serveren i det hele tatt: `POST /todo/:id/toggle`
leser aldri feltet, den bare flipper `completed`. Samtidig reagerer CSS-en du skrev på den
visuelle tilstanden umiddelbart — gjennomstrekingen fra holdeplass 4 slår inn i det du klikker,
og filteret fra holdeplass 10 kan skjule raden på flekken.

Prøv selv: huk av en todo, se den bli strøket over, og la være å trykke Toggle. Refresh. Den er
like uavkrysset som før. Du fikk optimistisk UI gratis, og du fikk ingen garanti for at det
stemmer.

**Og den lar seg ikke bare fikse.** Det nærliggende svaret er å droppe checkboxen og bruke én
submit-knapp som viser ☐ eller ☑ — da er ett klikk én runde til serveren, og ingenting kan
sprike. Men checkboxen er bærende: `:has(input:checked)` driver gjennomstrekingen (holdeplass 4),
telleren (5) og begge filtrene (10). Fjerner du den, faller fire holdeplasser sammen.

Det er den egentlige begrensningen. Ikke at «en checkbox ikke kan submitte», men at **samme
element må være både tilstandsmaskin for CSS og skjemafelt for serveren** — og de to rollene vil
ikke det samme.

> 🗣️ **Ingenting å implementere her** — bare spørsmål verdt å bli litt uenig om:
>
> - Er «null JavaScript» et mål i seg selv, eller et middel?
> - Er optimistisk UI som ikke kan rulles tilbake bedre eller verre enn ingen tilbakemelding?
> - Er en inline `onchange` noe annet enn å dra inn et rammeverk? Hvor går forskjellen?
> - CSS leser DOM-tilstand, serveren eier sannheten. Hvem burde gitt etter her?

### 🎯 Attributten vi ba deg la være

På holdeplass 1 ba vi deg droppe `autofocus`. Her er hvorfor — prøv det gjerne nå, så ser du det
selv.

Legg `autofocus` på input-feltet, scroll et stykke ned i lista, og huk av en todo. Du blir kastet
til toppen av siden. Det skjer på hver eneste handling, fordi alle tre går gjennom
POST/Redirect/GET, og fokus drar viewporten med seg dit det havner.

To innebygde oppførsler som hver for seg er helt riktige: *autofokus setter markøren i feltet*, og
*fokus scroller elementet inn i syne*. Sammen gir de en app som mister plassen din hver gang du
gjør noe.

Og bryteren mellom dem finnes ikke i HTML. Den heter `element.focus({ preventScroll: true })`, og
den er JavaScript.

**Og det stopper ikke der.** Ta bort `autofocus` igjen, scroll et stykke ned, og slett en todo.
Du havner fortsatt på toppen.

Hvorfor er **ikke avklart** — og vi lar det stå åpent her med vilje, fordi å finne det ut er en
bedre øvelse enn å få det servert. Tre ting som hver isolerer én mistenkt:

1. **Trykk Toggle i stedet for Slett.** Samme POST/Redirect/GET, men ingen dialog. Holder
   posisjonen da, er det dialogen som gjør noe.
2. **Kommenter ut `@view-transition` og slett igjen.** Holder posisjonen da, forstyrrer
   overgangen scrollgjenopprettingen.
3. **Slett noe, og trykk så Tilbake.** Havner du der du sto, *har* nettleseren posisjonen lagret
   — den bare bruker den ikke framover.

Det kan også hende ingenting er galt: POST/Redirect/GET lager en ny historikkoppføring, og
nettlesere gjenoppretter normalt bare scroll ved tilbake, fram og reload. Da er toppen riktig
oppførsel, og det er forventningen din som er feil.

Uansett hvilket svar du lander på, er utveien den samme: `history.scrollRestoration`, og å regne
ut posisjonen selv. JavaScript igjen.

> 🗣️ Verdt å bli uenig om:
>
> - Er dette plattformen som tar slutt, eller er `autofocus` bare feil verktøy her?
> - Feltet scrolles inn i syne fordi det er ute av syne. Hva om det aldri var det — hjelper
>   `position: sticky` på skjemaet? (Vi vet ikke. Prøv.)
> - Du fikk full funksjonalitet uten JavaScript. Du mistet kontrollen over hvor siden står når
>   den kommer tilbake. Er det en god bytte?
> - Hvor mange slike kollisjoner tror du det finnes som vi ikke har snublet i ennå?

### 🔜 Der HTML og CSS faktisk tar slutt

Et annet konkret svar på spørsmålet om hvor grensen går: **live oppdatering på tvers av
klienter.**
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

Todo-modellen er `{ id, description, completed, createdAt }`, og de fire rutene står listet i
[🧱 Etappe 1](#-etappe-1--bygg-appen). Malen får i tillegg hjelperen `created(todo)`, som
formaterer `createdAt` til lesbar dato — den brukes av popoveren på holdeplass 9.

> 💡 **En detalj som er gjort for deg:** hver `<li>` har `view-transition-name: todo-<id>`.
> Navnet må være unikt per element, og det er nettopp derfor id-en er med — noe du får bruk for
> i holdeplass 6, og igjen hvis du tar sidesporet om ankernavn.

---

## 📚 Ressurser

- 📖 [MDN: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- 🧭 [web.dev: Baseline](https://web.dev/baseline)
- 📊 [Can I use](https://caniuse.com/)
- 📰 [Chrome for Developers](https://developer.chrome.com/blog)
