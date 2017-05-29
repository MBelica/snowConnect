import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import { Debug } from './debug';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

@Injectable()
export class UserProvider {

    constructor(public http: Http, public api: Api, public auth: Auth, public user: User, public debug: Debug) {
    }

    /**
     * Send a auth request to our login endpoint with the data
     * the user entered on the form.
     */
    login(accountInfo: any) {
        this.auth.login('basic', accountInfo).then(() => {
              this._loggedIn();
        }, (e: IDetailedError<string[]>) => {
            this.debug.error(e);
        });
    }

    /**
     * Send a auth request to our signup endpoint with the data
     * the user entered on the form.
     */
    signup(accountInfo: any) {

        this.auth.signup(accountInfo).then(() => {
            this.auth.login('basic', accountInfo).then(() => {
                this._loggedIn();
            });
        }, (err: IDetailedError<string[]>) => {
              for (let e of err.details) {
                  if (e === 'conflict_email') {
                      //alert('Email already exists.');
                      // required_email: Missing email field
                      // required_password: Missing password
                      // conflict_username: A user has already signed up with the supplied username
                      // invalid_email: The email did not pass validation
                  } else {
                      this.debug.error(e);
                  }
              }
        });
    }

    requestPWRest(email: any) {
        this.auth.requestPasswordReset(email);
    }

    confirmPWReset(resetCode: any, newPassword: any) {
        this.auth.confirmPasswordReset(resetCode, newPassword);
    }

    /**
     * Log the user out, which forgets the session
     */
    logout() {
        this.auth.logout();
    }

    checkIfIsAuthenticated () {
        if (this.auth.isAuthenticated()) {
            // this.user is authenticated!
        }
    }

    fetchUserDetails () {
        this.user.details.username = '';
        this.user.details.email = '';
        this.user.details.password = '';
        this.user.details.name = '';
        this.user.details.image = '';
    }

    /**
     * Changes are local to the device until save() is called,
     *  which persists the user to servers. Local data always overwrites server data.
     */
    saveSettings () {
        this.user.save();
    }

    /**
     * Refreshing the User
     *  If you make changes to a user via the API, the user on the device will need to be refreshed.
     *  Once a user is logged in, you can call load().
     */
    refreshUser () {
        this.user.load().then(() => {
            // success!
        });
    }


    setUserSetting (key: any, value: any) {
        this.user.set(key, value);
    }

    getUserSetting (key: string) {
        this.user.get(key, false);
    }

    unsetUserSetting (key: any) {
        this.user.unset(key);
    }


    /**
     * Process a login/signup response to store user data
     */
    _loggedIn() {
        this.debug.log(this.user);
        this.refreshUser();
    }
}