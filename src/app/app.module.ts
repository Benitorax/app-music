import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from'@angular/forms';
import { BrowserAnimationsModule } from'@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from'@angular/common/http';
import { AdminModule } from'./admin/admin.module';
import { AdminRootingModule } from './admin/admin-rooting.module'
import { ShareModule } from'./share/share.module';

import * as firebase from 'firebase';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDetailsComponent } from './albums/album-details/album-details.component';
import { SearchComponent } from './albums/search/search.component';
import { AlbumDescriptionComponent } from './album-description/album-description.component';
import { LoginComponent } from './login/login.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { MiniAudioPlayerComponent } from './albums/album-details/mini-audio-player/mini-audio-player.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';

// Initialize Firebase
var config = {
//...
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlbumsComponent,
    AlbumDetailsComponent,
    SearchComponent,
    AlbumDescriptionComponent,
    LoginComponent,
    AudioPlayerComponent,
    MiniAudioPlayerComponent,
    DashboardComponent,
    AdminMainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    //RouterModule.forRoot(albumsRoutes), // Plus besoin en utilisant AppRoutingModule
    AdminRootingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AdminModule,
    ShareModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
