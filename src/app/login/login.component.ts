import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  email = '';
  parola = '';
  mesaj = '';

  showForgot = false;
  resetEmail = '';
  resetNouaParola = '';
  resetMsg = '';
  resetStatus = '';

  onLogin(): void {
 
    this.authService.login(this.email, this.parola).subscribe({
      next: res => {
        console.log('Răspuns primit:', res);

        if (res.status === 'success') {
          localStorage.setItem('user_id', res.id);
          localStorage.setItem('rol', res.rol);
          localStorage.setItem('cod_feedback', res.cod_feedback ?? '');
          this.router.navigate(['/' + res.rol]);
        } else {
          this.mesaj = 'Date incorecte!';
        }
      },
      error: () => {
        this.mesaj = 'Eroare conexiune cu serverul!';
      }
    });
  }

  resetParola(): void {
    this.resetMsg = 'Se procesează…';
    this.resetStatus = '';

    this.http
      .post<any>('http://localhost/feedbackapi-scoala/reset-password-simple.php', {
        email: this.resetEmail,
        parola: this.resetNouaParola
      })
      .subscribe({
        next: res => {
          this.resetStatus = res.status;
          this.resetMsg = res.message;

          if (res.status === 'success') {
            setTimeout(() => {
              this.showForgot = false;
              this.resetEmail = '';
              this.resetNouaParola = '';
              this.resetMsg = '';
            }, 2000);
          }
        },
        error: () => {
          this.resetStatus = 'error';
          this.resetMsg = 'A apărut o eroare la resetare';
        }
      });
  }
}
