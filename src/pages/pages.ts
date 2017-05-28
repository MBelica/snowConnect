import { ListMasterPage } from './list-master/list-master';
import { SearchPage } from './search/search';
import { SettingsPage } from './settings/settings';
import { TabsPage } from './tabs/tabs';
import { TutorialPage } from './tutorial/tutorial';
import { TrackingSpeed } from './tracking-speed/tracking-speed';
import { TrackingPage } from './tracking/tracking';
import { TrackingDebug } from './tracking-debug/tracking-debug';

// The page the user lands on after opening the app and without a session
export const Tracker = TrackingPage;
//export const Tutorial = TutorialPage;
export const Tutorial = TrackingPage;

// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = ListMasterPage;
export const Tab2Root = SearchPage;
export const Tab3Root = SettingsPage;

export const TrackingTab1Root = TrackingSpeed;
export const TrackingTab2Root = TrackingSpeed;
export const TrackingTab3Root = TrackingDebug;
