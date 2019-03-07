import { Injectable, EventEmitter, Output } from '@angular/core';
import * as firebase from'firebase/app';
import'firebase/auth';
import { Router } from '@angular/router';
import { observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private authState: boolean = false;
    stateEmitter = new Subject();
    helpError: string;

    constructor(private router: Router) { 
        firebase.auth().onAuthStateChanged( 
        (user) => {
            if (user) {
            this.authState = true;
            this.stateEmitter.next(this.authState);
            } else {
            this.authState = null;
            this.stateEmitter.next(this.authState);
            }
        }
        );
    }

    auth(email: string, password: string): Promise<any> {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    noActivateRememberMe() {
        return firebase.auth().setPersistence(
            firebase.auth.Auth.Persistence.SESSION
        );
    }

    activateRememberMe() {
        return firebase.auth().setPersistence(
            firebase.auth.Auth.Persistence.LOCAL
        );
    }

    authenticated() {
        return this.authState;
    }

    logout() {
        firebase.auth().signOut().then(
        () => {
            this.authState = false;
        },
        (error) => {
            this.helpError = `error: ${error.code} ${error.message}`;
            console.log(this.helpError);    
        }
        )
    }
}
