import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Album, List } from '../../album';
import { AlbumService } from 'src/app/album.service';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-album-details',
    templateUrl: './album-details.component.html',
    styleUrls: ['./album-details.component.scss'],
    animations: [
        trigger('selectAlbum', [
            state('selected', style({
                //height: '200px',
                //opacity: 1,
                //backgroundColor: 'red',
            })),
            state('noSelected', style({
                //height: '10px',
                opacity: 0,
                backgroundColor: 'grey',
                color: 'grey',
                right: '400px'
            })),
            transition('selected => noSelected', [
                animate('0.2s')
            ]),
            transition('noSelected => selected', [
                animate('0.3s 0.2s')
            ]),
        ]),
    ],
})
export class AlbumDetailsComponent implements OnInit {
    @Input() album: Album; // propriété [album] liée 
    @Output() onPlay: EventEmitter<Album> = new EventEmitter();
    songs: List;
    isActive: string;
    stateGrow: boolean = false;
    textButtonPlayer: string;
    songSelected;
    constructor(private albumService: AlbumService) { }

    ngOnInit() { 
        //console.log('ngOnInit is executed', this.albumLists);
        this.textButtonPlayer = "Play";
    }

    ngOnChanges() {
        if(this.album){
            // récupération de la liste des chansons
            this.albumService.getAlbumList(this.album.id).subscribe((albumList) => {
                this.songs = albumList;
                this.isActive = this.songs.list[0];
                this.songSelected = this.songs.list[0];
                

                this.stateGrow = false;
                let animation = setTimeout(() => {
                    this.stateGrow = true;
                }, 300);
            })
        }
    }

    textButtonToPlay() {
        this.textButtonPlayer = "Play";
    }

    onClick(song) {
        this.isActive = song;
        this.songSelected = song;
        this.textButtonToPlay();
    }
    selectSong($event) {
        this.isActive = $event;
    }

    play(album: Album) {
        this.onPlay.emit(album); // émettre un album vers le parent
        if(this.textButtonPlayer == "Play") {
            this.textButtonPlayer = "Stop";
            this.albumService.switchOn(album);
        } else {
            this.textButtonPlayer = "Play";
            this.albumService.switchOff(album);
        }
    }
}
