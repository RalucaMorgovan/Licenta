import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { ElevComponent } from './elev/elev.component';
import { ProfesorComponent } from './profesor/profesor.component';
import { SecretaraComponent } from './secretara/secretara.component';
import { DirectorComponent } from './director/director.component';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ElevComponent,
    ProfesorComponent,
    SecretaraComponent,
    DirectorComponent,
    FeedbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
