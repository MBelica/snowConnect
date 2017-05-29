import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, Config }  from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CardsPage } from '../pages/cards/cards';
import { ContentPage } from '../pages/content/content';
import { Tracker } from '../pages/pages';
import { Tutorial } from '../pages/pages';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TrackingPage } from '../pages/tracking/tracking';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';

import { Settings } from '../providers/providers';

import { TranslateService } from '@ngx-translate/core'

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.template.html'
})
export class snowConnect {

  rootPage: any;
  @ViewChild(Nav) nav: Nav;

  public title = 'snowConnect';

  pages: PageInterface[] = [
    { title: 'Tracker', name: 'TrackingPage', component: TrackingPage,  icon: 'speedometer' },
    { title: 'Home', name: 'TabsPage', component: TabsPage, icon: 'home' },
    { title: 'Cards', name: 'CardsPage', component: CardsPage, icon: 'albums' },
    { title: 'Content', name: 'ContentPage', component: ContentPage, icon: 'list' },
    { title: 'Map', name: 'MapPage', component: MapPage, icon: 'map' },
    { title: 'Master Detail', name: 'ListMasterPage', component: ListMasterPage, icon: 'book' },
    { title: 'Settings', name: 'SettingsPage', component: SettingsPage, icon: 'settings' },
    { title: 'Search', name: 'SearchPage', component: SearchPage, icon: 'search' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'Account', name: 'AccountPage', component: '', icon: 'person' }, //component: AccountPage, icon: 'person' },
    { title: 'Logout', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true },
    { title: 'Support', name: 'SupportPage', component:'', icon: 'help' },//component: SupportPage, icon: 'help' },
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Welcome', name: 'WelcomePage', component: WelcomePage, icon: 'apps' },
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', name: 'SignupPage', component: SignupPage, icon: 'person-add' },
    { title: 'Support', name: 'SupportPage', component: '', icon: 'help' },//component: SupportPage, icon: 'help' },
  ];

  constructor(private translate: TranslateService, private storage: Storage, private platform: Platform, private settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen, private events: Events, private menu: MenuController) {

    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (!hasSeenTutorial) {
          this.rootPage = Tracker;
        } else this.rootPage = Tutorial;
      });

    // decide which menu items should be hidden by current login status stored in local storage
    /*this.userData.hasLoggedIn().then((hasLoggedIn) => {
     this.enableMenu(hasLoggedIn === true);
     });*/
    this.enableMenu(true);
    this.listenToLoginEvents();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });


    this.initTranslate();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  menuClosed () {

    var menutoggle = document.querySelector('.menu-toggle');
    if (menutoggle !== null) menutoggle.classList.remove('open');
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}
