import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumComponent } from './album/album.component';
import { ShareModule } from '../share/share.module';
import { AdminRootingModule } from './admin-rooting.module';
import { AddAlbumComponent } from './add-album/add-album.component';
import { UpdateAlbumComponent } from './update-album/update-album.component';
import { DeleteAlbumComponent } from './delete-album/delete-album.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';

@NgModule({
  declarations: [
    AlbumComponent,
    AddAlbumComponent,
    UpdateAlbumComponent,
    DeleteAlbumComponent,
    ModalDialogComponent,
  ],
  imports: [
    CommonModule,
    ShareModule,
    AdminRootingModule,
  ],
  exports : [
    AlbumComponent,
  ]
})
export class AdminModule { }
