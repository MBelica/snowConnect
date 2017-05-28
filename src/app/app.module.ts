import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { snowConnect } from './app.component';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { TrackingDebug } from '../pages/tracking-debug/tracking-debug';
import { TrackingPage } from '../pages/tracking/tracking';
import { TrackingSpeed } from '../pages/tracking-speed/tracking-speed';
import { WelcomePage } from '../pages/welcome/welcome';

import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { LocationProvider } from "../providers/location";
import { StatsProvider } from "../providers/stats";
import { nStorage } from '../providers/nstorage';
import { Debug } from '../providers/debug';

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}


/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  snowConnect,
  CardsPage,
  ContentPage,
  ItemCreatePage,
  ItemDetailPage,
  ListMasterPage,
  TrackingPage,
  LoginPage,
  MapPage,
  MenuPage,
  SearchPage,
  SettingsPage,
  SignupPage,
  TabsPage,
  TrackingDebug,
  TrackingSpeed,
  TutorialPage,
  WelcomePage
];


export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
    return [
        Api,
        BackgroundGeolocation,
        Items,
        User,
        Camera,
        GoogleMaps,
        InAppBrowser,
        SplashScreen,
        StatusBar,
        Geolocation,
        LocationProvider,
        StatsProvider,
        nStorage,
        Debug,

        { provide: Settings, useFactory: provideSettings, deps: [Storage] },
        // Keep this to enable Ionic's runtime error handling during development
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ];
}

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b4220ee2'
  }
};

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(snowConnect),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule { }
