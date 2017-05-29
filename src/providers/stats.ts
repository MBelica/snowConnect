import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

// todo last session wäre interessant genauso wie last day bzw ein paar
// todo   Server updates
// todo   Save km/h, mph und Celsius, Kelvin
// todo    Freunde stats vergleichen, freunde finden, freunde chatten
// todo    personal bests
// todo    save day / session, reset only session and reset all somewhere else
// todo    saved days and sessions delete after a time
// todo     After Welcome page show either login if we have internet connection and offer signup or signin
// todo     or check if there is an registered account offline and sync at a later point
// todo       save in some cloud service
// todo       Deploy and Push service

/*
 /*
 Generated class for the StatsProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class StatsProvider {

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

    public static allStatsInstances: any[] = [];
    public static allLocationInstances: any[] = [];


    private static tempTotal: any = { topSpeed:  0, distance: 0, calories: 0, time: 0 };
    private static tempDay: any = {topSpeed: 0, distance: 0, calories: 0, positions: [], tpositions: '', time: 0, date: 0};


    constructor(public storage: Storage) {

        this.today = this.dateObj.getUTCFullYear() + "/" + (this.dateObj.getUTCMonth() + 1) + "/" + this.dateObj.getUTCDate();
        StatsProvider.allStatsInstances.push(this);
    }

    createBackup = function ( key: any, stats: any ) {
        if (key = 'day') { // todo save to file // todo upload
          // todo save day
        }

    }

    saveData = function(key: any) { // todo save on disc

        if (key = 'total') { // totalStats
            this.storage.ready().then(() => {

                this.storage.set( 'personalStats_totalRecords', this.totalStats );
            });
        }
        else if (key = 'day') { // dayStats
            this.storage.ready().then(() => {

                this.storage.set( 'personalStats_dayRecords', this.dayStats );
            });
        }
    };


    fetchData ( )  {
        var resultTotal = this.storage.get('personalStats_totalRecords');
        if (resultTotal === null) {
            this.totalStats  = StatsProvider.tempTotal;
            this.saveData( 'total' );
        } else this.totalStats = resultTotal;

        var resultDay = this.storage.get('personalStats_dayRecords');
        if (resultDay === null) {
            this.dayStats = StatsProvider.tempDay;
            this.saveData( 'day' );
        } else {
            if (this.dayStats['date'] != this.today) {
              this.createBackup('day', this.dayStats);
              this.resetDay();
            } else this.dayStats = resultDay;
        }
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

        this.dayStats = {
          topSpeed: 0,
          distance: 0,
          calories: 0,
          positions: [],
          tpositions: '',
          time: 0,
          date: this.today
        };
        this.saveData( 'day' );
    };

    resetTotal = function() {

        this.totalStats = {
          topSpeed:  0,
          distance: 0,
          calories: 0,
          time: 0,
        };
        this.saveData( 'total' );
    };

    resetAllStats = function () {

        for (let pointer of StatsProvider.allLocationInstances) {
            pointer.isRunning = false;
            if (pointer.watch != null) pointer.watch.unsubscribe();
            if (pointer.backgroundGeolocation != null) pointer.backgroundGeolocation.stop();
            StatsProvider.allLocationInstances.splice(StatsProvider.allLocationInstances.indexOf(pointer), 1);
        }

        this.resetDay();
        this.resetTotal();
        for (let pointer of StatsProvider.allStatsInstances) {

            pointer.sessionStats = {
                topSpeed: 0,
                distance: 0,
                calories: 0,
                positions: [],
                tpositions: '',
                start: 0,
                end: 0
            };
            StatsProvider.allStatsInstances.splice(StatsProvider.allStatsInstances.indexOf(pointer), 1);
        }
    }

}
