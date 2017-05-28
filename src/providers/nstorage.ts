import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { Debug } from './debug';

import 'rxjs/add/operator/map';

/*
 Generated class for the NstorageProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

// todo Read, create, change, upload file and backup in e.g. Google Docs or something similiar
// todo Write functions for parsing into data formats, in date formats, for google maps etc. and similiar things
// todo Was kann ich denn nich si machen, auf dieser Stelle und damit wird das ganze um einiges härter

// Der gGedanke der Struktur sollte eigentlich ganz klar sein- Wir haben einen Kontroller, der Über das Template in die Injektors called und die einzelnen Providers,
// // der eine der sich um die Stats called, diese Tracked, ausgibt und ähnliches, der andere der die Lpcation berechnet und daraus alle Werte ermittelt
// Und für alle nativen Prozesse, wie das Speichern in Dateien sollte ein eigenener Controller geschrieben sein, möglichst abgeschlossen und auf debug ausgelegt

@Injectable()
export class nStorage {

    constructor(private http: Http, private storage: Storage, private debug: Debug, private file: File) {
      //
    }

    public storageSetObj = function(key, value) {

        try {
            this.storage.setItem(key, JSON.stringify(value), function(){}, function(err){console.error('Native Storage SET Failed:' + err);});
        } catch (err) { console.error(err); }
    };

    public storageGetObj = function(key, success, error) {

        //return JSON.parse(localStorage.getItem(key));
        try {
            this.storage.getItem(key, success, function(err){console.error('Native Storage GET '+key+' Failed:' + err);});
        } catch (err) { this.debug.error(err); }
    };

    public writeToFile = function(datas, filename) {

        var path = this.file.dataDirectory;
        try {
            this.file.resolveLocalFilesystemUrl(path).then((directoryEntry: any) => {

                this.file.getFile(directoryEntry, filename, {
                    create: true
                }).then((fileEntry: any) => {
                    fileEntry.createWriter(function(writer) {
                        //  todo was called das?
                        writer.onwrite = function() {};
                        writer.onerror = function(e) { this.debug.error(e); };

                        writer.fileName = filename;
                        writer.write(new Blob([JSON.stringify(datas)], { type: 'text/plain' }));
                    }, function() {  this.debug.error('Cant write ' + filename);  });
                });

            });
        } catch (err) { this.debug.error('writeSessionsToFile:' + err); }
    };
}
