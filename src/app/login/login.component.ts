import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from'@angular/forms'; // template-driven
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    helpError;
    
    constructor(
        private auth: AuthService,
        private router: Router
    ) { 
    }

    ngOnInit() {
        this.auth.subjectAuthState.subscribe(user =>{
            if(user){
                this.router.navigate(['admin']);
            } 
        });
    }

    onSubmit(loginForm: NgForm): void {
        if(!loginForm.value['rememberMe']) {
            this.auth.noActivateRememberMe();
            console.log('not remember be !');
        } else {
            this.auth.activateRememberMe();
            console.log('remember be !');
        }

        let promise = this.auth
        .auth(loginForm.value['email'], loginForm.value['password'])
        .then(
            user => { 
                this.router.navigate(['admin']);
            },
            error => {
                this.helpError = `error: ${error.code} ${error.message}`;
                console.log(this.helpError);
            }
        );
    }
}
