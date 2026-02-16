# Artes — Artikulačný test

Webová aplikácia pre artikulačné (výslovnostné) testovanie detí. Umožňuje evidovať viacero detí, prechádzať slovník slov po fonémach a zapisovať výsledky (OK, nezrelé, distorzné, absentujúce alebo substitúcie). Výsledky sa ukladajú v prehliadači (localStorage) a aplikácia počíta sumárne štatistiky a fonetický repertoár.

**Live:** [https://mirelon.github.io/artes/](https://mirelon.github.io/artes/)

## Funkcie

- **Profil dieťaťa** — meno, dátum narodenia (DD.MM.YYYY), pohlavie
- **Zoznam detí** — pridávanie, výber, úprava a mazanie profilov
- **Slová podľa foném** — slová z `words.txt` sa rozložia na fonémy so slovenskými pravidlami (diftongy, spodobovanie, mäkčenie)
- **Záznam po fonémach** — pre každú fonému: OK, NZ (nezrelé), D (distorzné), A (absentujúce), alebo záznam substitúcie (čo dieťa skutočne povedalo)
- **Výsledky** — suma cieľových/správnych konsonantov a vokálov, SRF/SVK/SVV, fonetický repertoár (konsonanty vo všetkých pozíciách, nekonštantné, nezrelé, distorzné, absentujúce)
- **Navigácia** — šípky alebo swipe medzi slovami, Escape späť na zoznam/výsledky

## Technológie

- **React 19** + **TypeScript**
- **Vite 6** (build, dev server)
- **ESLint** (lint), **Vitest** (testy)
- **gh-pages** — nasadenie na GitHub Pages

## Spustenie

```bash
npm install
npm run dev
```

Otvorte [http://localhost:5173](http://localhost:5173).

## Štruktúra projektu

- `src/App.tsx` — hlavná aplikácia, stav stránok a načítanie slov
- `src/appState.ts` — typy a logika stavu (deti, aktuálne dieťa, localStorage)
- `src/phonemes.ts` — rozklad slov na fonémy (slovenčina: diftongy, spodobovanie, mäkčenie)
- `src/results.ts` — typy výsledkov (OK, IMMATURE, DISTORTED, ABSENT), počítanie správnych konsonantov/vokálov/foném
- `src/positions.ts` — štatistiky podľa pozície (I/M/F) a fonetický repertoár
- `src/helpers.ts` — načítanie `words.txt`, `limitedZip`, `formatPercentage`
- `src/pages.ts` — typ stránok: `childrenList` | `childDisplay` | `wordDisplay`
- `src/ChidrenList.tsx` — zoznam detí a pridávanie/úprava/mazanie
- `src/ChildDisplay.tsx` — profil dieťaťa a tabuľka výsledkov
- `src/WordDisplay.tsx` — zobrazenie slova po fonémach a navigácia
- `src/PhonemeBox.tsx` — jeden box fonémy so stavom a tlačidlami NZ/D/A
- `public/words.txt` — zoznam slov (jeden riadok = jedno slovo)

## Dáta

Stav aplikácie (`children`, `currentChildId`, výsledky) sa ukladá do `localStorage` pod kľúčom `artesAppState`. Slová sa načítavajú z `public/words.txt` pri štarte.
