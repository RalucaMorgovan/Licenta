import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost/feedbackapi-scoala/login.php';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, parola: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, parola });
  }
    logout() {
    localStorage.clear();
    this.router.navigate(['/']);
}
}
