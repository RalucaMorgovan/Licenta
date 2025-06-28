import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface MaterieElev {
  materie_clasa_id: number;
  materie: string;
  completat: boolean;
    profesor: string;  
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  materie_clasa_id!: number;
  cod_feedback = '';

  materiiElev: MaterieElev[] = [];
  materieNume = '';

  raspunsuri: number[] = Array(16).fill(0);
  intrebarile: string[] = [
    'Profesorul explică clar materia.',
    'Profesorul îmi explică moduri în care să învăț mai eficient.',
    'Sarcinile de lucru la clasă sunt interesante.',
    'Profesorul încurajează participarea tuturor elevilor în cadrul orelor.',
    'Profesorul încurajează cooperarea între elevi.',
    'Mă simt motivat să particip la această disciplină.',
    'Profesorul folosește tehnologia digitală.',
    'Profesorul explică modul în care ești evaluat și criteriile de evaluare.',
    'Profesorul încurajează competitivitatea între elevi.',
    'Elevii sunt încurajați să-și exprime ideile și opiniile.',
    'Atmosfera este plăcută în cadrul orelor.',
    'Mă simt în siguranță și confortabil la această oră.',
    'Profesorul ia în considerare și respectă Statutul Elevului.',
    'Ritmul de parcurgere a materiei este potrivit pentru mine.',
    'Profesorul este interesat de starea mea de bine.',
    'Fac efort mare acasă pentru rezultate bune la această disciplină.'
  ];

  mesaj = '';
  dorinta: string = '';
  gandProfesor: string = '';
  prezenta: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.materie_clasa_id = Number(this.route.snapshot.paramMap.get('id'));
    this.cod_feedback = localStorage.getItem('cod_feedback') || '';

    const elevId = localStorage.getItem('user_id');
    if (!elevId) {
      this.router.navigate(['/']);
      return;
    }

    this.http
      .post<any>('http://localhost/feedbackapi-scoala/get-elev-info.php', {
        elev_id: elevId
      })
      .subscribe({
        next: res => {
          if (res.status === 'success') {
            this.materiiElev = res.materii as MaterieElev[];
            const gasita = this.materiiElev.find(
              m => m.materie_clasa_id === this.materie_clasa_id
            );
            this.materieNume = gasita?.materie || 'Materie necunoscută';
                    this.profesorNume = gasita?.profesor || 'Profesor necunoscut';  

          } else {
            this.mesaj = res.message || 'Nu am putut prelua materia.';
          }
        },
        error: () => {
          this.mesaj = 'Eroare la conexiunea cu serverul.';
        }
        
      });
      
  }

  trimiteFeedback(): void {
    if (this.raspunsuri.includes(0)) {
      this.mesaj = 'Te rugăm să răspunzi la toate întrebările.';
      return;
    }

    if (!this.dorinta.trim()) {
      this.mesaj = 'Te rugăm să ne spui dorinţa ta pentru această disciplină.';
      return;
    }

    if (!this.gandProfesor.trim()) {
      this.mesaj = 'Te rugăm să laşi un gând pentru profesor.';
      return;
    }

    if (!this.prezenta) {
      this.mesaj = 'Te rugăm să selectezi procentajul de ore la care ai fost prezent.';
      return;
    }

    this.http
      .post<any>('http://localhost/feedbackapi-scoala/submit-feedback.php', {
        cod_feedback: this.cod_feedback,
        materie_clasa_id: this.materie_clasa_id,
        raspunsuri: this.raspunsuri,
        dorinta: this.dorinta,
        gand_profesor: this.gandProfesor,
        prezenta: this.prezenta
      })
      .subscribe({
        next: res => {
          if (res.status === 'success') {
            this.mesaj = 'Feedback trimis cu succes!';
            setTimeout(() => this.router.navigate(['/elev']), 2000);
          } else {
            this.mesaj = res.message || 'A apărut o eroare la trimitere.';
          }
        },
        error: () => {
          this.mesaj = 'Eroare la conexiunea cu serverul.';
        }
      });
  }
    profesorNume = '';  // ← nou

}

