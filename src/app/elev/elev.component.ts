import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StareFeedbackService } from '../stare-feedback.service';
import { AuthService }       from '../auth.service';

interface Materie {
  materie_clasa_id: number;
  materie: string;
  completat: boolean;
}
@Component({
  selector: 'app-elev',
  templateUrl: './elev.component.html',
      styleUrls: ['./elev.component.scss']
})
export class ElevComponent {
  nume: string = '';
  prenume: string = '';
  clasa: string = '';
  materii: Materie[] = [];
  feedbackActiv = false;

  constructor(private http: HttpClient, private router: Router,  private stareSvc: StareFeedbackService,  private auth: AuthService,
) {}

  ngOnInit() {
        this.stareSvc.stare$.subscribe(active => this.feedbackActiv = active);

    const elev_id = localStorage.getItem('user_id');
    if (!elev_id) {
      this.router.navigate(['/']); 
      return;
    }
    

    this.http.post<any>('http://localhost/feedbackapi-scoala/get-elev-info.php', {
      elev_id: elev_id
    }).subscribe(res => {
      if (res.status === 'success') {
        this.nume = res.nume;
        this.prenume = res.prenume;
        this.clasa = res.clasa;
        this.materii = res.materii;
      }
    });
  }

  evalueaza(materie_clasa_id: number) {
    this.router.navigate(['/feedback', materie_clasa_id]);
  }

  logout() {
    this.auth.logout();
  }
}
