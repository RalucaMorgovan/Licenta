import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

interface DetailedFeedback {
  cod_feedback:   string;
  materie:        string;
  clasa:          string;
  data:           string;
  q1: number;  q2: number;  q3: number;  q4: number;  q5: number;
  q6: number;  q7: number;  q8: number;  q9: number;  q10: number;
  q11: number; q12: number; q13: number; q14: number; q15: number; q16: number;
  dorinta:        string;
  gand_profesor:  string;
  prezenta:       string;
    [key: string]: string | number;

}

interface Profesor {
  id: number;
  nume: string;
}
@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.scss']

})
export class DirectorComponent implements OnInit {

  constructor(private http: HttpClient,  private auth: AuthService
) {}

  logout() {
    this.auth.logout();
  }
  ngOnInit(): void {  
    this.getClase();
    this.cautaFeedback();
    this.getStareFeedback();
    this.toggleStare();
    this.getProfesori();

  }
  getProfesorNume(id: number): string {
    const p = this.profesori.find(x => x.id === id);
    return p ? p.nume : '';
  }


  
clasaSelectata = '';
clase: any[] = [];
feedbackuri: any[] = [];
  reminderStatus = '';  
  mesaj = '';

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

  trimiteReminder() {
    this.reminderStatus = 'Se trimit remindere…';

    this.http.get<any>('http://localhost/feedbackapi-scoala/send-reminder.php')
      .subscribe({
        next: res => {
          this.reminderStatus = `Trimise: ${res.sent.length}, Eșuate: ${res.failed.length}`;
        },
        error: err => {
          console.error('Eroare HTTP:', err);
          this.reminderStatus = 'A apărut o eroare la trimiterea remindere-lor.';
        }
      });
  }


totalElevi: number | null = null;
votanti: number | null = null;
procentaj: number | null = null;



  feedbackActiv = false;
  dataInchidere: string | null = null;

  getStareFeedback() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-stare-feedback.php')
      .subscribe(res => {
        if (res.status === 'success') {
          this.feedbackActiv = res.activ;
          this.dataInchidere = res.data_inchidere;
        }
      });
    }
      dataInchidereLocal = '';  
toggleStare() {
  const nouActiv = this.feedbackActiv ? 0 : 1;
  this.http.post<any>('http://localhost/feedbackapi-scoala/toggle-stare-feedback.php', {
    activ: nouActiv,
    data_inchidere: this.dataInchidereLocal
  }).subscribe(res => {
    this.feedbackActiv   = !!res.activ;
    this.dataInchidere   = res.data_inchidere;
  });
}



getClasaNume(): string {
  const c = this.clase.find(x => x.id === +this.clasaSelectata);
  return c ? c.nume : '';
}

cautaFeedback() {
  if (!this.clasaSelectata) return;
  this.http.post<any>('http://localhost/feedbackapi-scoala/get-feedback-director.php', {
    clasa_id: this.clasaSelectata
  }).subscribe(res => {
    if (res.status === 'success') {
      this.totalElevi = res.total_elevi;
      this.votanti   = res.votanti;
      this.procentaj = res.procentaj;
      this.feedbackuri = res.feedbackuri;
    }
  });
}

onClasaChange() {
  console.log('Clasa selectată din dropdown:', this.clasaSelectata);
}
 detailedFeedback: DetailedFeedback[] = [];

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

  profesori: Profesor[]         = [];
  profesorSelectat: number|null = null;
  mesajProf = '';
    getProfesori() {
    this.http.get<any>('http://localhost/feedbackapi-scoala/get-profesori.php')
      .subscribe(res => {
        if (res.status === 'success') this.profesori = res.profesori;
      });
  }
  cautaFeedbackClasa() {
    if (!this.clasaSelectata) return;

  }
  vedeFeedbackProfesor() {
    if (!this.profesorSelectat) return;
    this.http.post<any>(
      'http://localhost/feedbackapi-scoala/get-feedback-detailed-profesor.php',
      { profesor_id: this.profesorSelectat }
    ).subscribe(res => {
      if (res.status === 'success') {
        this.detailedFeedback = res.details as DetailedFeedback[];
      }
    });
  }

}
