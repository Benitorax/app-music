import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginateComponent } from './paginate/paginate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PaginateComponent
  ],
  imports: [
    CommonModule,

  ],
  exports : [
    PaginateComponent,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class ShareModule { }
