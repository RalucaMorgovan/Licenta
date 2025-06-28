import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ElevComponent } from './elev/elev.component';
import { ProfesorComponent } from './profesor/profesor.component';
import { SecretaraComponent } from './secretara/secretara.component';
import { DirectorComponent } from './director/director.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'elev', component: ElevComponent },
  { path: 'profesor', component: ProfesorComponent },
  { path: 'secretara', component: SecretaraComponent },
  { path: 'director', component: DirectorComponent },
  { path: 'feedback/:id', component: FeedbackComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
