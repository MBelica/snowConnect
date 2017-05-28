import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { LocationProvider } from './location';
import 'rxjs/add/operator/map';

// todo last session wäre interessant genauso wie last day bzw ein paar
// todo   Server updates
// todo   Save km/h, mph und Celsius, Kelvin
// todo    Freunde stats vergleichen, freunde finden, freunde chatten
// todo    personal bests
// todo    save day / session, reset only session and reset all somewhere else
// todo    saved days and sessions delete after a time

/*
 /*
 Generated class for the StatsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class StatsProvider {

  public static allInstances: any[] = [];
  public totalStats: any = {
    topSpeed:  0,
    distance: 0,
    calories: 0,
    time: 0
  };
  public dayStats: any = {
    topSpeed: 0,
    distance: 0,
    calories: 0,
    positions: [],
    tpositions: '',
    time: 0,
    date: 0
  };
  public sessionStats: any = {
    topSpeed:  0,
    distance: 0,
    calories: 0,
    positions: [],
    tpositions: '',
    start: 0,
    end: 0
  };

  protected dateObj : any = new Date();
  protected today   : any ;

  constructor(public storage: Storage) {

    this.today = this.dateObj.getUTCFullYear() + "/" + (this.dateObj.getUTCMonth() + 1) + "/" + this.dateObj.getUTCDate();
    StatsProvider.allInstances.push(this);
  }

  saveAllData = function (data: any[]) {

    for (var j = 1; j < 3; j++) this.saveData(data[j],j);
  };

  saveData = function(data: any, mode: number = 0) {

    if (mode = 1) { // totalStats
      this.storage.ready().then(() => {

        this.storage.set('personalStats_totalRecords', data);
      });
    }
    else if (mode = 2) { // dayStats
      this.storage.ready().then(() => {

        this.storage.set('personalStats_dayRecords', data);
      });
    }
  };

  fetchData = function( mode: number = 0)  {

    var result : any;
    if (mode = 1) { // totalStats

      result = this.storage.get('personalStats_totalRecords');
    }
    else if (mode = 2) { // dayStats

      result = this.storage.get('personalStats_dayRecords');
    }

    return result;
  };


  resetSession = function() {

    this.sessionStats = {
      topSpeed:  0,
      distance: 0,
      calories: 0,
      positions: [],
      tpositions: '',
      start: 0,
      end: 0
    };
  };

  resetDay = function() {
    // todo backup day

    this.dayStats = {
      topSpeed: 0,
      distance: 0,
      calories: 0,
      positions: [],
      tpositions: '',
      time: 0,
      date: this.today
    };
    this.saveData( this.dayStats, 2);
  };

  resetTotal = function() {

    this.totalStats = {
      topSpeed:  0,
      distance: 0,
      calories: 0,
      time: 0,
    };
    this.saveData( this.totalStats, 1);
  };

  resetAllStats = function () {

    // todo todo
    /*  for (let pointer of LocationProvider.allInstances) {
     pointer.isRunning = false;
     if (pointer.watch != null) pointer.watch.unsubscribe();
     if (pointer.backgroundGeolocation != null) pointer.backgroundGeolocation.stop();
     }*/

    for (let pointer of StatsProvider.allInstances) {

      pointer.resetTotal();

      pointer.resetDay();

      pointer.sessionStats = {
        topSpeed: 0,
        distance: 0,
        calories: 0,
        positions: [],
        tpositions: '',
        start: 0,
        end: 0
      };
    }
  }

}
