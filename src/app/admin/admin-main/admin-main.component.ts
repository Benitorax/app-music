import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ShareModule } from '../../share/share.module';

@NgModule({
  declarations: [
  ],
  imports: [
    ShareModule,
  ],
  exports : [
  ]
})
@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
