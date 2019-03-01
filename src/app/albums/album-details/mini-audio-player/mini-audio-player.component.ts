import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Album, List } from '../../../album';
import { AlbumService } from '../../../album.service';
import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
    selector: 'app-mini-audio-player',
    templateUrl: './mini-audio-player.component.html',
    styleUrls: ['./mini-audio-player.component.scss']
})
export class MiniAudioPlayerComponent implements OnInit {
    album: Album; // propriété [album] liée 
    songs: List;
    ratio: number;
    ratioTime: Date;
    showplayer;
    duration: number;
    progressSubscription;
    @Input() songPlayed: string;
    @Output() onPlay: EventEmitter<Album> = new EventEmitter();
    @Output() onFinish: EventEmitter<Album> = new EventEmitter();
    indexSong: number;

    constructor(private aS: AlbumService) { }

    ngOnInit() {
        this.play();
    }

    ngOnChanges() {
        if(this.progressSubscription) {
            this.progressSubscription.unsubscribe();
        }
        console.log(this.songPlayed);
        this.showplayer = false;
        this.ratio = 0;
        this.play();
    }

    play() {
        if(this.progressSubscription) {
            this.progressSubscription.unsubscribe();
        }
        this.aS.subjectAlbum.subscribe(
            album => { 
                this.showplayer = true;
                this.album = album;
                this.songs = this.aS.getAlbumList(album.id);

                if(album.status == 'on') {
                    if(this.progressSubscription) {
                        this.progressSubscription.unsubscribe();
                    }
                    this.progress(this.songPlayed);
                } else if (album.status == 'off') {
                    this.progressSubscription.unsubscribe();
                    this.showplayer = false;
                    this.ratio = 0;
                }
            }
        )
    }

    progress(song) {
        this.duration = this.album.duration / this.songs.list.length / 20;
        this.songPlayed = song;
        this.indexSong = this.songs.list.indexOf(song);
        const count: any = interval(1000).pipe(
            take((this.duration*this.songs.list.length))
        );

        this.progressSubscription = count.subscribe(
            count => { 
                this.ratio = count;
                
                let date = new Date(0);
                date.setMinutes(count);
                date.setHours(-0.1);
                this.ratioTime = date;

                if(this.ratioTime >= this.toDate(this.duration)) {
                    let index = this.songs.list.indexOf(song);

                    if(song = this.songs.list[index+1]) {
                        this.progressSubscription.unsubscribe();
                        this.progress(song);
                        this.select(song);
                    } else {
                        this.progressSubscription.unsubscribe();
                        this.showplayer = false;
                        this.ratio = 0;
                    }
                }
            }
        );
    }

    select(songPlayed) {
        this.onPlay.emit(songPlayed); 
    }

    finish() {
        this.onFinish.emit(); 
    }

    toDate(minutes) {
        let date = new Date(0);
        let hours = Math.floor(minutes/60);
        minutes = minutes - hours*60
        date.setHours(hours);
        date.setMinutes(minutes)
        
        return date;
    }
}
