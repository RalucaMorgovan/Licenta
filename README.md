# FeedbackScoala

Acest proiect este o aplicație web pentru evaluarea și monitorizarea feedback-ului elev–profesor, realizată în cadrul lucrării de licență.

## Adresa repository

Codul sursă complet (fără fișiere binare) este disponibil pe GitHub:  
**https://github.com/RalucaMorgovan/Licenta**

---

## Tehnologii utilizate

- **Frontend:** Angular 16  
- **Backend:** PHP (WAMP)  
- **Bază de date:** MySQL  
- **Instrumente folosite:** Visual Studio Code, phpMyAdmin, GitHub

---

## Pașii de instalare și rulare a aplicației

### 1. Frontend (Angular)

- Se clonează repository-ul de pe GitHub.
- Se deschide folderul proiectului în Visual Studio Code.
- Se rulează comanda `npm install` pentru instalarea dependențelor.
- Se pornește aplicația cu comanda: `ng serve`.
- Se accesează aplicația în browser la adresa: **http://localhost:4200/**.

### 2. Backend (PHP + MySQL)

- Se pornește serverul WAMP.
- Se copiază folderul `api` (care conține fișierele PHP) în `C:/wamp64/www/feedback_scoala/api`.
- Se accesează phpMyAdmin și se creează baza de date `feedback_scoala`.
- Se importă fișierul `feedback_scoala.sql` în baza de date.
- Se verifică fișierul `db.php` să conțină următoarele date de conectare:
  - server: `localhost`
  - utilizator: `root`
  - parolă: *(goală)*
  - baza de date: `feedback_scoala`
- Nu este nevoie de compilare pentru backend. Deschiderea WAMP și plasarea fișierelor în `www` sunt suficiente pentru funcționare.

---

## Alte detalii

- Aplicația este complet funcțională local, rulând simultan Angular (`ng serve`) și WAMP.
- Codul este împărțit clar în frontend (`src/`) și backend (`api/`).
- Nu s-au folosit fișiere binare sau compilate în GitHub.
- Partea de backend (PHP + SQL) este inclusă complet în repository, în subfolderul `api`.

