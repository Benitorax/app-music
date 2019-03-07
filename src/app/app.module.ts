import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from'@angular/forms';
import { BrowserAnimationsModule } from'@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from'@angular/common/http';

import * as firebase from 'firebase';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumDetailsComponent } from './albums/album-details/album-details.component';
import { SearchComponent } from './albums/search/search.component';
import { AlbumDescriptionComponent } from './album-description/album-description.component';
import { LoginComponent } from './login/login.component';
import { PaginateComponent } from './albums/paginate/paginate.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { MiniAudioPlayerComponent } from './albums/album-details/mini-audio-player/mini-audio-player.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAlMzn5fsy94cvhP7rYvn1BxdPCbwB_r20",
  authDomain: "app-music-2204d.firebaseapp.com",
  databaseURL: "https://app-music-2204d.firebaseio.com",
  projectId: "app-music-2204d",
  storageBucket: "app-music-2204d.appspot.com",
  messagingSenderId: "305260599235"
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
    PaginateComponent,
    AudioPlayerComponent,
    MiniAudioPlayerComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    //RouterModule.forRoot(albumsRoutes), // Plus besoin en utilisant AppRoutingModule
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
