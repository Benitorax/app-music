import { Component, OnInit, Input, Output } from '@angular/core';
import { Album, List } from '../album';
import { AlbumService } from '../album.service';
import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
    album: Album; // propriété [album] liée 
    songs: List;
    ratio: number;
    ratioTime: Date;
    showplayer;
    duration: number;
    progressDuration;
    songPlayed: string;
    indexSong: number;

    constructor(private aS: AlbumService) { }

    ngOnInit() {
        this.aS.subjectAlbum.subscribe(
            album => { 
                this.showplayer = true;
                this.album = album;
                this.songs = this.aS.getAlbumList(this.album.id);

                if(album.status == 'on') {
                    if(this.progressDuration) {
                        this.progressDuration.unsubscribe();
                    }
                    this.progress();
                } else if (album.status == 'off') {
                    this.progressDuration.unsubscribe();
                    this.showplayer = false;
                    this.ratio = 0;
                }
            }
        )
    }

    ngOnChanges() {
    }

    progress() {
        this.duration = this.album.duration / 60;

        const count: any = interval(1000).pipe(
            take(this.duration + 1)
        );

        this.progressDuration = count.subscribe(
            count => { 
                this.ratio = count;
                
                let date = new Date(0);
                date.setHours(count);
                this.ratioTime = date;
            }
        );

        this.playSongs();
    }

    playSongs() {
        let timer = Math.floor(this.duration / this.songs.list.length);
        this.indexSong = 0;
        this.songPlayed = this.songs.list[this.indexSong];

        let myInterval = setInterval(()=>{
            this.songPlayed = this.songs.list[this.indexSong];
            this.indexSong++;
        }, timer*1000);

        setTimeout(() => {
            clearInterval(myInterval);
            //this.songPlayed = null;
        }, this.duration*1000);
    }

    toDate(minutes) {
        let date = new Date(0);
        let hours = Math.floor(minutes/60);
        minutes = minutes - hours*60;
        date.setHours(hours);
        date.setMinutes(minutes)
        
        return date;
    }
}
