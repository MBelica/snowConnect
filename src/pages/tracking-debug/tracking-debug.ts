import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { StatsProvider } from '../../providers/stats';
import { LocationProvider } from '../../providers/location';

/**
 * Generated class for the TrackingDebugPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tracking-debug',
  templateUrl: 'tracking-debug.html',
})
export class TrackingDebug {

  constructor(public navCtrl: NavController, public navParams: NavParams, public location: LocationProvider, public stats: StatsProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrackingDebugPage');
  }

  menuToggleClass() {
    document.querySelector('.menu-toggle').classList.toggle('open');
  }
}
