import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Debug } from './debug';
import { StatsProvider } from './stats';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
/*
 Generated class for the LocationProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */

@Injectable()
export class LocationProvider {

    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    public acc: number = 0;
    public alt: number = 0;
    public alc: number = 0;
    public spd: number = 0;
    public gpsSpd: number = 0;
    public tsp: any = 0;
    public isRunning: boolean = false;
    public depreciatedSpeed: number = 0;

    //protected onLift : boolean = true;
    protected speedUnit: number = 0; // 0: km/h, 1: m/s, 2: mph, 3: fps
    protected statsLoaded: boolean = false;

    constructor(public platform: Platform, private debug: Debug, public zone: NgZone, public stats: StatsProvider, public backgroundGeolocation: BackgroundGeolocation, public geolocation: Geolocation, public storage: Storage) {

        this.storage.ready().then(() => {
            this.statsLoaded = true;
            this.stats.fetchData();
        });
        StatsProvider.allLocationInstances.push(this);
    }

    // todo while running and tracking update data every x seconds on disc
    // todo save session
    // todo save day etc.
    // todo save total

    startTracking() {

        this.debug.log('method startTracking()');

        if (!this.statsLoaded) {
            this.debug.log('stats not loaded yet, give it a sec.');
            return;
        } else if (this.isRunning) {
            this.debug.log('already running');
            return;
        }

        this.isRunning = true;
        this.stats.sessionStats['start'] = new Date().getTime();

        // Background Tracking
        let config: BackgroundGeolocationConfig = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: false,
            interval: 2000,
        };
        this.backgroundGeolocation.configure(config)
            .subscribe((location: any) => {
                // IMPORTANT:  executing the finish method here to inform the native plugin that I'm finished,
                // and the background-task may be completed. IF DON'T, ios will CRASH APP for spending too much time in the background.
                this.backgroundGeolocation.finish(); // FOR IOS ONLY

                // Run update inside of Angular's zone
                this.zone.run(() => {
                    var timestamp = new Date().getTime();
                    var dtsp      = (Math.round(timestamp - this.tsp) / 1000);
                    if (dtsp  > 0.1 ) {
                        this.debug.log('BG Geolocation (lat,long): ' + location.latitude + ',' + location.longitude);
                        this.debug.log('BG Geolocation (alt,spd): '  + location.altitude + ',' + location.speed);
                        var timestamp = new Date().getTime();
                        this.handlePosChange(location.latitude,
                                             location.longitude,
                                             location.accuracy,
                                             location.altitude,
                                             location.altitudeAccuracy,
                                             location.speed,
                                             timestamp, dtsp);
                    }
                });
            }, (err) => { this.debug.log(err); });

        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start();

        // Foreground Tracking
        let options = { // todo diese Stats durchgehen
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 3000
        };

        this.watch = this.geolocation.watchPosition(options)
            .filter((p: any) => p.coords !== undefined) //Filter Out Errors
            .subscribe((position: Geoposition) => {

                // Run update inside of Angular's zone
                this.zone.run(() => {
                    var timestamp = new Date().getTime();
                    var dtsp      = (Math.round(timestamp - this.tsp) / 1000);
                    if ( dtsp  > 0.5 ) {
                        this.debug.log('Geolocation (lat,long): ' + position.coords.latitude + ',' + position.coords.longitude);
                        this.debug.log('Geolocation (alt,spd): '  + position.coords.altitude + ',' + position.coords.speed);
                        this.handlePosChange(position.coords.latitude,
                                             position.coords.longitude,
                                             position.coords.accuracy,
                                             position.coords.altitude,
                                             position.coords.altitudeAccuracy,
                                             position.coords.speed,
                                             timestamp, dtsp);
                    }
                });
            });
    }

    stopTracking() {
        this.debug.log('method stopTracking()');
        if (this.isRunning) this.stats.sessionStats['end'] = new Date().getTime();
        this.isRunning = false;

        // todo save session
        // todo save day etc.
        // todo save total

        if (this.watch != null) this.watch.unsubscribe();
        if (this.backgroundGeolocation != null) this.backgroundGeolocation.stop();

        this.lat = 0;
        this.lng = 0;
        this.acc = 0;
        this.alt = 0;
        this.alc = 0;
        this.spd = 0;
        this.tsp = 0;
        this.depreciatedSpeed = 0;

        this.stats.resetSession();
    }

    handlePosChange(latitude: any, longitude: any, accuracy: any, altitude: any, altitudeAccuracy: any, speed: any, timestamp: any, dtsp: any) {
        this.debug.log('method handlePosChange()');
        var marginalDistance: number = 0;

        if ((this.lat != 0) && (this.lng != 0)) {
            marginalDistance = this.getDistanceFromLatLonInKm(this.lat, this.lng, latitude, longitude);
        } else this.debug.log('Warning: Latitude or Longitude = 0');

        if ( (marginalDistance > 0.025) || (this.lat == 0) || (this.lng == 0)) {
            this.debug.log('PosChange, marginalDistance: ' + marginalDistance);

            var tempPos = [latitude, longitude, altitude];
            this.updateDistance(marginalDistance);
            this.speedCorrection(this.depreciatedSpeed, this.spd, speed, marginalDistance, this.tsp, timestamp, dtsp, tempPos);

            this.lat = latitude;
            this.lng = longitude;
            this.acc = accuracy;
            this.alt = altitude;
            this.alc = altitudeAccuracy;
            this.tsp = timestamp;
            this.gpsSpd = speed;
        } else this.debug.log('Warning: marginalDistance < 0.1 or lat/long = 0, not updating position');
    }

    /*
     * updatePosition
     *  mspeed: speed in km/h, i.e. if handling we have to convert speed
     */
    updatePosition(tempPos: any, timestamp: any, mspeed: any) {
        var temp = [tempPos, timestamp, mspeed];

        this.stats.dayStats['positions'].push(temp);
        this.stats.sessionStats['positions'].push(temp);

        this.stats.dayStats['tpositions']     = JSON.stringify(this.stats.dayStats['positions']);
        this.stats.sessionStats['tpositions'] = JSON.stringify(this.stats.sessionStats['positions']);
    }

    updateDistance(marginalDistance: any) {

        var tempDay = this.stats.dayStats['distance'] + marginalDistance;
        this.stats.dayStats['distance'] = Math.round(tempDay * 100000) / 100000;

        var tempTotal = this.stats.totalStats['distance'] + marginalDistance;
        this.stats.totalStats['distance'] = Math.round(tempTotal * 100000) / 100000;

        var tempSession = this.stats.sessionStats['distance'] + marginalDistance;
        this.stats.sessionStats['distance'] = Math.round(tempSession * 100000) / 100000;
    }

    statsUpdate() {
        this.debug.log('method statsUpdate()');

        if (this.stats.totalStats['topSpeed'] < this.spd) {
            this.debug.log('statsUpdate, totalSpeed updated to: ' + this.spd + ', from:' + this.stats.totalStats['topSpeed'] );
            this.stats.totalStats['topSpeed'] = this.spd;
        }
        if (this.stats.dayStats['topSpeed'] < this.spd) {
            this.debug.log('statsUpdate, daySpeed updated to: ' + this.spd + ', from:' + this.stats.dayStats['topSpeed'] );
            this.stats.dayStats['topSpeed'] = this.spd;
        }
        if (this.stats.sessionStats['topSpeed'] < this.spd) {
            this.debug.log('statsUpdate, sessionSpeed updated to: ' + this.spd + ', from:' + this.stats.sessionStats['topSpeed'] );
            this.stats.sessionStats['topSpeed'] = this.spd;
        }
    }

    speedCorrection(depreciatedSpeed: any, oldSpeed: any, speed: any, marginalDistance: any, oldTimestamp: any, timestamp: any, dtsp: any, tempPos: any) {
        this.debug.log('method speedCorrection()');
        var dt = timestamp - oldTimestamp;
        var mspeed = 0;

        if ( (dt < 60000) || (oldTimestamp != 0) || (timestamp != 0) || (timestamp != oldTimestamp) )  mspeed = marginalDistance / (dtsp  / 60 / 60);
        else {
            mspeed = speed;
            this.debug.log('Warning: speed correction - tsps equal or either one equal to zero)');
        }
        if (mspeed > 260) mspeed = oldSpeed;
        else if ( ((mspeed / 5) > oldSpeed) && (dt < 3) && (oldSpeed !== 0) ) mspeed = oldSpeed;

        this.debug.log('speedCorrection, marginalDistance: ' + marginalDistance + ', dtsp:' + dtsp);
        this.debug.log('speedCorrection, calcSpeed: ' + mspeed + ', gpsSpeed:' + speed + ', old: ' + oldSpeed + ', depSpeed: ' + depreciatedSpeed);
        this.depreciatedSpeed = this.spd;
        this.spd = this.convertSpeed(mspeed);

        this.statsUpdate();
        this.updatePosition(tempPos, timestamp, mspeed);
    }

    convertSpeed(speed: number = 0) {
        this.debug.log('method convertSpeed()');

        var converted: number = speed;

        if (this.speedUnit == 1) converted = (speed / 3.6); // km/h to m/s
        else if (this.speedUnit == 2) converted = (speed * 0.621371192237); // km/h to mph
        else if (this.speedUnit == 3) converted = (speed * 0.911344415281); // km/h to fps

        converted = Math.round(converted * 10) / 10;

        this.debug.log('convertSpeed, speed: ' + speed + ', converted: ' + converted);
        return converted;
    }

    getDistanceFromLatLonInKm(lat1: any, lon1: any, lat2: any, lon2: any) {
        this.debug.log('method getDistanceFromLatLonInKm()');

        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c    = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d    = R * c;

        return d;
    }

    deg2rad(deg: any) {
        return deg * (Math.PI / 180)
    }
}
