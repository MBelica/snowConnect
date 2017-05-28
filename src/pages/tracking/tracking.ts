import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { TrackingTab1Root } from '../pages';
import { TrackingTab2Root } from '../pages';
import { TrackingTab3Root } from '../pages';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tracking.html'
})
export class TrackingPage {
  trackingTab1Root: any = TrackingTab1Root;
  trackingTab2Root: any = TrackingTab2Root;
  trackingTab3Root: any = TrackingTab3Root;

  trackingTab1Title = " ";
  trackingTab2Title = " ";
  trackingTab3Title = " ";

  constructor(public navCtrl: NavController, public translateService: TranslateService) {
    translateService.get(['TRACKING_TAB1_TITLE', 'TRACKING_TAB2_TITLE', 'TRACKING_TAB3_TITLE']).subscribe(values => {
      this.trackingTab1Title = values['TRACKING_TAB1_TITLE'];
      this.trackingTab2Title = values['TRACKING_TAB2_TITLE'];
      this.trackingTab3Title = values['TRACKING_TAB3_TITLE'];
    });
  }
}
