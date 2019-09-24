import { NgModule } from '@angular/core';
import { CronberryComponent } from './cronberry.component';
import { HttpModule } from '@angular/http';
import { AsyncPipe} from '@angular/common';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyBYtmUdRrxSZUCbkpzM1fsrxlhGVeWnRCw",
          authDomain: "bitshorts-880fc.firebaseapp.com",
          databaseURL: "https://bitshorts-880fc.firebaseio.com",
          projectId: "bitshorts-880fc",
          storageBucket: "bitshorts-880fc.appspot.com",
          messagingSenderId: "16319431289",
          appId: "1:16319431289:web:d7d1793a6159d2a7"
  }
};


@NgModule({
  imports: [
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers:[
    HttpModule,
    AsyncPipe,
    CronberryComponent
  ],
  declarations: [],
  exports: []  
})
export class CronberryModule { }
