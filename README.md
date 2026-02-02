# Personal Life Dashboard

Web aplikacija za organizaciju studentskog života sa integrisanim zabavnim i produktivnim modulima.  
Cilj projekta je omogućiti studentima da na jednom mjestu prate svoje obaveze, ali i koriste interaktivne module za učenje i opuštanje.

---

## 🚀 Kako pokrenuti projekat

### Instalacija

1. Instalirati potrebne zavisnosti:
npm install
Pokrenuti development server:

ng serve
Aplikacija će biti dostupna na:
http://localhost:4200/

## Firebase konfiguracija i deploy
Projekat koristi Firebase Hosting za produkcioni deploy.

### Live verzija
Aplikacija je dostupna na:
https://personal-life-dashboard-f9406.web.app

Build za production:

ng build --configuration production
Deploy na Firebase:

firebase deploy --only hosting

## Funkcionalnosti

Module Selector
Glavni meni aplikacije sadrži dvije sekcije:

### Tracker moduli
Korisnik bira koje module želi prikazati na svom dashboard-u.
Svaki modul se selektuje pomoću checkbox-a, a izbor se čuva u localStorage-u po korisničkom imenu.

### Student Fun Zone
Interaktivni moduli koji se ne prikazuju na dashboard-u, već se otvaraju kao zasebne stranice.

### Student Fun Zone moduli
### Bingo
Klasična Bingo igra sa 5x5 tablicom

Nasumično izvlačenje brojeva

Automatsko označavanje polja

Detekcija pobjede (red, kolona ili dijagonala)

WIN animacija

Reset dugme za novu igru

### Kviz
5 pitanja vezanih za web development

Radio buttons i checkboxes za odgovore

Vizuelna provjera tačnosti (zeleno / crveno)

Automatski izračun skora

Bonus animacija za perfect score (konfeti)

### Kanban Board
Tri kolone: To Do, In Progress, Done

Dodavanje kartica sa naslovom i opisom

Drag & drop između kolona

Brisanje kartica

Export u PDF (koristeći window.print)

Slanje putem email-a (mailto link)

### Whiteboard
Canvas element za crtanje

Birač boje (color picker)

Podešavanje debljine linije

Eraser funkcija

Clear dugme za brisanje svega

Download crteža kao .png

Watermark logo u pozadini

### Vision Board
Dodavanje post-it bilješki (nasumične boje)

Dodavanje slika iz galerije

Dodavanje citata

Drag & drop svih elemenata

Pin dugme za uklanjanje elemenata

Recent tray (posljednja 3 uklonjena elementa)

Restore funkcija

Automatsko čuvanje u localStorage

## Tehnička implementacija

### Frontend
Angular 19 sa standalone komponentama 

TypeScript za type safety

FormsModule za two-way binding

Specifične tehnologije po modulu
Canvas API (Whiteboard)

Drag & Drop API (Kanban, Vision Board)

LocalStorage (čuvanje stanja aplikacije)

Window Print API (PDF export)

Mailto protokol (email funkcionalnost)

### Backend i hosting

Firebase Hosting (production deploy)

Firebase Authentication (Email / Password)

Firebase Firestore (planirano za buduće verzije)

## Struktura projekta
src/
├── app/
│   ├── components/          # Login, Register, Module Selector
│   ├── modules/             # Fun Zone moduli
│   │   ├── bingo/
│   │   ├── quiz/
│   │   ├── kanban-board/
│   │   ├── whiteboard/
│   │   └── vision-board/
│   ├── services/            # AuthService, ModuleService
│   └── models/              # TypeScript interfejsi
└── assets/
    └── images/              # Slike i Vision Board galerija
## Dizajn
Aplikacija koristi CSS varijable za podršku različitih tema

--background-color

--text-color

--card-bg

--primary-color

--secondary-color

Layout je responsive i prilagođen desktop, tablet i mobilnim uređajima.

## Live verzija
Aplikacija je dostupna na:
https://personal-life-dashboard-f9406.web.app


## Dependencies (ključni paketi)

@angular/core ^19.x

@angular/router ^19.x

@angular/forms ^19.x

firebase ^10.x

html2canvas ^1.x

## Autor
Ime i prezime: Eldar Dizdarević
Email: dzceldar@gmail.com
Akademska godina: 2025/2026
Predmet: Web Programiranje
Projekat: Personal Life Dashboard - Angular & Firebase
