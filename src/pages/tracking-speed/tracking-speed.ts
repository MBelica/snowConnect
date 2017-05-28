import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { StatsProvider } from '../../providers/stats';
import { LocationProvider } from '../../providers/location';

/**
 * Generated class for the TrackerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tracker',
  templateUrl: 'tracking-speed.html',
})
export class TrackingSpeed {

  public deviceID: any = '1';

  protected today : any = '';
  protected dateObj: any = new Date();

  constructor(public location: LocationProvider, public stats: StatsProvider) {
    this.today = this.dateObj.getUTCFullYear() + "/" + (this.dateObj.getUTCMonth() + 1) + "/" + this.dateObj.getUTCDate();
  }

  start() {


    if ( this.stats.dayStats['date'] != this.today ) this.stats.resetDay();

    this.location.startTracking();
  }

  stop() {

    this.location.stopTracking();
  }

  reset() {

    this.stats.resetAllStats();
  }

  menuToggleClass() {
    document.querySelector('.menu-toggle').classList.toggle('open');
  }

}
