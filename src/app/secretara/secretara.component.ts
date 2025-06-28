import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService }       from '../auth.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FeedbackProfesor {
  materie: string;
  clasa: string;
  nr_feedbackuri: number;
  medie: number;
}

interface DetailedFeedback {
  cod_feedback: string;
  materie:      string;
  clasa:        string;
  data:         string;
  // întrebări 1–16
  q1: number;  q2: number;  q3: number;  q4: number;
  q5: number;  q6: number;  q7: number;  q8: number;
  q9: number;  q10: number; q11: number; q12: number;
  q13: number; q14: number; q15: number; q16: number;
  [key: string]: string | number;
    dorinta:        string;
  gand_profesor:  string;
  prezenta:       string;
}



@Component({
  selector: 'app-secretara',
  templateUrl: './secretara.component.html',
  styleUrls: ['./secretara.component.scss']
})
export class SecretaraComponent implements OnInit {
  showElevi = true;
  showProfesori = true;
  showMaterii = true;
  showFeedbackProfesor = true;   // ← nou

  // Date introduse de secretară
  nume: string = '';
  prenume: string = '';
  clasa_id: string = '';

  // Liste preluate din backend
  clase: any[] = [];
  elevi: any[] = [];
  profesori: any[] = [];
  materii: any[] = [];
  listaMaterii: any[] = [];
  // feedback profesor
  feedbackProf: FeedbackProfesor[] = [];
  mesajProf = '';
  mesaj = '';

  // Elev selectat pentru modificare
  elevSelectat: any = {
    id: 0,
    nume: '',
    prenume: '',
    email: '',
    parola: '',
    clasa_id: null
  };

  // Profesor selectat
  profesorSelectat: any = null;

  // Materie-Clasă selectată
  materieSelectata: any = null;

  // Date formular profesor
  numeProfesor: string = '';
  materie_id: string = '';
  clasa_prof_id: string = '';

  // Date formular materie
  numeMaterie = '';
  profesor_id = '';

  constructor(private http: HttpClient,     private router: Router,  private auth: AuthService,
) {}

  ngOnInit(): void {
    this.getClase();
    this.getElevi();
    this.getProfesori();
    this.getMaterii();
    this.getListaMaterii();
  }
detailedFeedback: DetailedFeedback[] = [];
// înainte aveai 10; acum pui toate cele 16
questions: string[] = [
  "Profesorul explică clar materia.",
  "Profesorul îmi explică moduri în care să învăț mai eficient.",
  "Sarcinile de lucru la clasă sunt interesante.",
  "Profesorul încurajează participarea tuturor elevilor în cadrul orelor.",
  "Profesorul încurajează cooperarea între elevi.",
  "Mă simt motivat să particip la această disciplină.",
  "Profesorul folosește tehnologia digitală.",
  "Profesorul explică modul în care ești evaluat și criteriile de evaluare.",
  "Profesorul încurajează competitivitatea între elevi.",
  "Elevii sunt încurajați să-și exprime ideile și opiniile.",
  "Atmosfera este plăcută în cadrul orelor.",
  "Mă simt în siguranță și confortabil la această oră.",
  "Profesorul ia în considerare și respectă Statutul Elevului.",
  "Ritmul de parcurgere a materiei este potrivit pentru mine.",
  "Profesorul este interesat de starea mea de bine.",
  "Fac efort mare acasă pentru rezultate bune la această disciplină."
];


exportPdfProfesor() {
  const orig = document.querySelector('.detailed-feedback table') as HTMLElement;
  if (!orig) return;

  const clone = orig.cloneNode(true) as HTMLElement;
  clone.classList.remove('offscreen');
  Object.assign(clone.style, {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    visibility: 'visible',
    background: '#fff',      
  });

  clone.querySelectorAll('th, td').forEach(el => {
    (el as HTMLElement).style.border = '1px solid rgba(0,0,0,0.1)';
  });

  document.body.appendChild(clone);

  html2canvas(clone, { scale: 2 }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf     = new jsPDF('p', 'mm', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth  = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
    pdf.save(`feedback_prof_${this.getProfesorNume(this.profesorSelectat!)}.pdf`);
  }).finally(() => {
    document.body.removeChild(clone);
  });
}




  /** Clase */
getClase() {
  this.http.get<any>('http://localhost/feedbackapi-scoala/get-clase.php')
    .subscribe({
      next: res => {
        this.clase = (res.clase || []).sort((a: any, b: any) => {
          const ra = a.nume.match(/^(\d+)([A-Z])$/)!;
          const rb = b.nume.match(/^(\d+)([A-Z])$/)!;
          const na = parseInt(ra[1], 10);
          const nb = parseInt(rb[1], 10);
          if (na !== nb) return na - nb;
          return ra[2].localeCompare(rb[2]);
        });
      },
      error: () => this.mesaj = 'Eroare la încărcarea claselor!'
    });
}


  getElevi() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-elevi.php').subscribe({
      next: res => this.elevi = res.elevi || [],
      error: () => this.mesaj = 'Eroare la încărcarea elevilor!'
    });
  }
    getProfesori() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-profesori.php').subscribe({
      next: res => this.profesori = res.profesori || [],
      error: () => this.mesaj = 'Eroare la încărcarea profesorilor.'
    });
  }
    getMaterii() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-materii.php').subscribe({
      next: res => this.materii = res.materii || [],
      error: () => this.mesaj = 'Eroare la încărcarea materiilor.'
    });
  }

  adaugaElev() {
    if (!this.nume || !this.prenume || !this.clasa_id) {
      this.mesaj = 'Completează toate câmpurile!';
      return;
    }
    const payload = { nume: this.nume, prenume: this.prenume, clasa_id: this.clasa_id };
      this.http.post<any>('http://localhost/feedbackapi-scoala/add-elev.php', payload)
        .subscribe({
          next: res => {
            if (res.status === 'success') {
              this.mesaj = `Elev adăugat! Email: ${res.email}, Parolă: ${res.parola}`;
              this.getElevi();
              this.nume = this.prenume = this.clasa_id = '';
            } else {
      Swal.fire('Eroare', 'Nu am putut adăuga elevul.', 'error');
            }
          },
  error: () => Swal.fire('Eroare', 'Conexiune eşuată.', 'error')
        });
  }

stergeElev(id: number) {
  Swal.fire({
    title: 'Eşti sigur?',
    text: 'Elevul va fi şters definitiv!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, şterge!',
    cancelButtonText: 'Renunţ'
  }).then(result => {
    if (result.isConfirmed) {
      this.http.post<any>(
        'http://localhost/feedbackapi-scoala/delete-elev.php',
        { id }
      ).subscribe({
        next: res => {
          if (res.status === 'success') {
            this.getElevi();
            Swal.fire('Şters!', 'Elevul a fost şters.', 'success');
          } else {
            Swal.fire('Eroare', 'Nu am putut şterge elevul.', 'error');
          }
        },
        error: () => Swal.fire('Eroare', 'Conexiune eşuată.', 'error')
      });
    }
  });
}

  selecteazaElev(elev: any) {
    this.elevSelectat = { ...elev };
      setTimeout(() => {
    const el = document.getElementById('modificare-elev');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);

  }

  actualizeazaElev() {
    if (!this.elevSelectat.id) {
      alert('ID-ul elevului lipsește.');
      return;
    }
    this.http.post<any>('http://localhost/feedbackapi-scoala/update-elev.php', this.elevSelectat)
      .subscribe({
        next: res => {
          if (res.status === 'success') {
            alert('Elev actualizat!');
            this.getElevi();
            this.elevSelectat = { id:0, nume:'', prenume:'', email:'', parola:'', clasa_id:null };
          } else {
            alert(res.message || 'Eroare la actualizare');
          }
        },
        error: () => alert('Eroare conexiune la server.')
      });
  }

  /** Profesori */


 stergeProfesor(id: number) {
  Swal.fire({
    title: 'Ești sigur?',
    text: 'Profesorul va fi șters definitiv!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, șterge!',
    cancelButtonText: 'Renunț'
  }).then(result => {
    if (result.isConfirmed) {
      this.http.post<any>(
        'http://localhost/feedbackapi-scoala/delete-profesor.php',
        { id }
      ).subscribe({
        next: res => {
          if (res.status === 'success') {
            this.getProfesori();
            Swal.fire('Șters!', 'Profesorul a fost șters.', 'success');
          } else {
            Swal.fire('Eroare', 'Nu am putut șterge profesorul.', 'error');
          }
        },
        error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
      });
    }
  });
}

// Adaugă profesor
adaugaProfesor() {
  if (!this.numeProfesor || !this.materie_id || !this.clasa_prof_id) {
    Swal.fire('Atentie', 'Completează toate câmpurile!', 'info');
    return;
  }
  const payload = {
    nume: this.numeProfesor,
    materie_id: this.materie_id,
    clasa_id: this.clasa_prof_id
  };
  this.http.post<any>(
    'http://localhost/feedbackapi-scoala/add-profesor.php',
    payload
  ).subscribe({
    next: res => {
      if (res.status === 'success') {
        Swal.fire({
          title: 'Succes!',
          html: `Profesor adăugat!<br>Email: ${res.email}<br>Parolă: ${res.parola}`,
          icon: 'success'
        });
        this.numeProfesor = this.materie_id = this.clasa_prof_id = '';
        this.getProfesori();
      } else {
        Swal.fire('Eroare', res.message || 'Adăugare eșuată.', 'error');
      }
    },
    error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
  });
}
  getProfesorNume(id: number): string {
    const prof = this.profesori.find(p => p.id === id);
    return prof ? prof.nume : '';
  }

// Modifică profesor
actualizeazaProfesor() {
  if (!this.profesorSelectat?.id) {
    Swal.fire('Eroare', 'Profesor invalid.', 'error');
    return;
  }
  this.http.post<any>(
    'http://localhost/feedbackapi-scoala/update-profesor.php',
    this.profesorSelectat
  ).subscribe({
    next: res => {
      if (res.status === 'success') {
        Swal.fire('Actualizat!', 'Datele profesorului au fost salvate.', 'success');
        this.getProfesori();
        this.profesorSelectat = null;
      } else {
        Swal.fire('Eroare', res.message || 'Actualizare eșuată.', 'error');
      }
    },
    error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
  });
}
  selecteazaProfesor(profesor: any) {
    this.profesorSelectat = { ...profesor };
      setTimeout(() => {
    const el = document.getElementById('modificare-prof');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);


  }

  
  /** Materii */


  // Șterge materie
stergeMaterie(id: number) {
  Swal.fire({
    title: 'Ești sigur?',
    text: 'Această asociere materie-clasă va fi ștearsă!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Da, șterge!',
    cancelButtonText: 'Renunț'
  }).then(result => {
    if (result.isConfirmed) {
      this.http.post<any>(
        'http://localhost/feedbackapi-scoala/delete-materie.php',
        { id }
      ).subscribe({
        next: res => {
          if (res.status === 'success') {
            this.getListaMaterii();
            Swal.fire('Șters!', 'Materia a fost ștearsă.', 'success');
          } else {
            Swal.fire('Eroare', 'Nu am putut șterge materia.', 'error');
          }
        },
        error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
      });
    }
  });
}

// Adaugă materie
adaugaMaterie() {
  if (!this.numeMaterie || !this.clasa_id || !this.profesor_id) {
    Swal.fire('Atentie', 'Completează toate câmpurile!', 'info');
    return;
  }
  const payload = {
    nume: this.numeMaterie,
    clasa_id: this.clasa_id,
    profesor_id: this.profesor_id
  };
  this.http.post<any>(
    'http://localhost/feedbackapi-scoala/add-materie.php',
    payload
  ).subscribe({
    next: res => {
      if (res.status === 'success') {
        Swal.fire('Succes!', 'Materie adăugată cu succes.', 'success');
        this.numeMaterie = this.clasa_id = this.profesor_id = '';
        this.getListaMaterii();
      } else {
        Swal.fire('Eroare', res.message || 'Adăugare eșuată.', 'error');
      }
    },
    error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
  });
}

// Modifică materie–clasă
actualizeazaMaterieClasa() {
  if (!this.materieSelectata?.id) {
    Swal.fire('Eroare', 'Materie invalidă.', 'error');
    return;
  }
  this.http.post<any>(
    'http://localhost/feedbackapi-scoala/update-materie-clasa.php',
    this.materieSelectata
  ).subscribe({
    next: res => {
      if (res.status === 'success') {
        Swal.fire('Actualizat!', 'Asocierea a fost actualizată.', 'success');
        this.getListaMaterii();
        this.materieSelectata = null;
      } else {
        Swal.fire('Eroare', res.message || 'Actualizare eșuată.', 'error');
      }
    },
    error: () => Swal.fire('Eroare', 'Conexiune eșuată.', 'error')
  });
}

  getListaMaterii() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-materii-complet.php').subscribe({
      next: res => this.listaMaterii = res.materii || [],
      error: () => this.mesaj = 'Eroare la încărcarea listei de materii.'
    });
  }

  
  selecteazaMaterie(materie: any) {
    this.materieSelectata = { ...materie };
      setTimeout(() => {
    const el = document.getElementById('modificare-materie');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);

  }

  
/** returnează elevii sortați 9a→9b→9c→9d */
getSortedElevi() {
  const order = ['9a','9b','9c','9d'];
  return this.elevi
    .slice()
    .sort((a, b) => order.indexOf(a.clasa) - order.indexOf(b.clasa));
}
  logout() {
    this.auth.logout();   
  }

    vedeFeedbackProfesor() {
    this.mesajProf = '';
    this.feedbackProf = [];
    if (!this.profesorSelectat) {
      this.mesajProf = 'Alege întâi un profesor';
      return;
    }
   this.http.post<any>('http://localhost/feedbackapi-scoala/get-feedback-detailed-profesor.php',
  { profesor_id: this.profesorSelectat }
       ).subscribe({
          next: res => {
           if (res.status === 'success') {
             this.detailedFeedback = res.details;
    }
  },
  error: err => console.error('Detalii feedback error', err)
});
  }
}
