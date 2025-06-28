# FeedbackScoala

Acest proiect este o aplicație web pentru evaluarea cadrelor didactice.

## Adresa repository

Codul sursă complet este disponibil pe GitHub:  
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
  - parolă: `root`
  - baza de date: `feedback_scoala`

---

