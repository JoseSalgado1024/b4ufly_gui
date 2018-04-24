import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DataAcquireService } from './data-acquire.service';
import { ModalModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDbhCrdAzmNDaXgabM4-KoVQQUmD9zSX64'
    })
  ],
  providers: [DataAcquireService],
  bootstrap: [AppComponent]
})
export class AppModule { }
