import { Component } from '@angular/core';
import { interval, Observable, observable } from'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app-music';
    pipeTimer;
    timer: Date;
    authState: boolean;

    constructor(
        private aS: AuthService,
        private router: Router
    ) {
        this.aS.subjectAuthState.subscribe(user =>{
            if(user){
                this.authState = true;
                console.log('authState true');
                //this.router.navigate(['albums']);
            } else {
                this.authState = false;
                console.log('authState false');
                this.router.navigate(['login']);
            }
        });

    }
    
    ngOnInit() {
        const count: any = interval(1000);

        this.pipeTimer = count.pipe(
            take(60*12), // actuellement 12min, à changer pour 12h.
            map((count: number) => {
                let date = new Date(0);
                date.setSeconds(count);
                date.setHours(-0.1);
                return date;
            })
        );
        this.pipeTimer.subscribe(
            date => this.timer = date
        );
    }


}
