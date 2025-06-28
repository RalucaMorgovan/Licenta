import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.scss']
})
export class ProfesorComponent implements OnInit {
  materii: any[] = [];
  mesaj: string = '';

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('user_id'));
    if (!userId) {
      this.mesaj = 'Nu ești autentificat ca profesor.';
      return;
    }



this.http.post<any>('http://localhost/feedbackapi-scoala/get-materii-profesor.php', {
  user_id: userId
}).subscribe({
  next: res => {
    this.materii = res.materii;
  },
  error: err => {
    this.mesaj = 'Eroare la conexiune';
  }
});



}
  logout() {
    this.auth.logout();
  }
}