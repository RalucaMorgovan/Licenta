import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';

interface StareResp {
  status: string;
  activ: boolean;
  data_inchidere: string | null;
}

@Injectable({ providedIn: 'root' })
export class StareFeedbackService {
  private url = 'http://localhost/feedbackapi-scoala/get-stare-feedback.php';

  public stare$: Observable<boolean> = this.http.get<StareResp>(this.url).pipe(
    map(r => r.status === 'success' && r.activ),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}
}
