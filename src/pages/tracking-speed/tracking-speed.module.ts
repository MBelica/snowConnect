import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingSpeed } from './tracking-speed';

@NgModule({
  declarations: [
    TrackingSpeed,
  ],
  imports: [
    IonicPageModule.forChild(TrackingSpeed),
  ],
  exports: [
    TrackingSpeed
  ]
})
export class TrackerPageModule {}
