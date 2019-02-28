import { Component, OnInit, Input } from '@angular/core';
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
    showplayer;
    duration: number;
    progressDuration;
    songPlayed;

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

                let timer = this.duration / this.songs.list.length;
                let i = 0;

                /*let myInterval = setInterval(
                    () => {                        
                        this.songPlayed = this.songs.list[i];
                        i++;
                        console.log(i, this.songPlayed)
                    }    
                , timer);*/
                //clearInterval(myInterval);
                /*let index = Math.floor(this.ratio / this.duration);
                this.songPlayed = this.songs[index] ;
                console.log(this.songPlayed, index)*/
            }
        );
    }

    minToDate(min) {
        let date = new Date(0);
        date.setSeconds(min);
        return date;
    }

    secToDate(secondes) {
        let date = new Date(0);
        date.setSeconds(secondes*60);
        return date;
    }
}
