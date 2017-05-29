import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the DebugControllerProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

// todo Wählen zwischen debug in console, Datei oder ähnliches schreiben
// todo Methoden schreiben, die alles Unvrhergesehende an eine API übergeben, dass zwar die App weiterläuft, aber ich auf dem Server reports darüber bekomme
@Injectable()
export class Debug {

  protected DEBUG_LEVEL: number = 5;

  // todo create something to upload file
  // todo create push service for errors and debugging etc. (background)
  // todo create method for toast messages

  constructor(public http: Http) {

  }

  public log(msg) {
    var text = '#Proxi: ' + msg;
    console.log( JSON.stringify(text, null, 2) );
  }

  public error(err) {
    var text = '!#Proxi: ' + err;
    console.error(text);
  }

}
