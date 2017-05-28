import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackingDebug } from './tracking-debug';

@NgModule({
  declarations: [
    TrackingDebug,
  ],
  imports: [
    IonicPageModule.forChild(TrackingDebug),
  ],
  exports: [
    TrackingDebug
  ]
})
export class TrackingDebugPageModule {}
