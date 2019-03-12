import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './album/album.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from '../guard.service';
import { AddAlbumComponent } from './add-album/add-album.component';
import { UpdateAlbumComponent } from './update-album/update-album.component';
import { DeleteAlbumComponent } from './delete-album/delete-album.component';

//import { AlbumComponent } from './admin.module';

const routes: Routes = [
  {
    path:'admin',
    component: AdminMainComponent,
    children: [
      {
        path:'',
        component:AlbumComponent,
      },
      {
        path:'album/add', 
        canActivate: [GuardService], 
        component: AddAlbumComponent 
      },
      {
        path:'album/update/:id', 
        canActivate: [GuardService], 
        component: UpdateAlbumComponent 
      },
      {
        path:'album/delete/:id/:action', 
        canActivate: [GuardService], 
        component: DeleteAlbumComponent 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRootingModule { }
