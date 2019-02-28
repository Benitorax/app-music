import { Component, OnInit } from '@angular/core';
import { Album } from'../album';
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { AlbumService } from '../album.service';
import {
    trigger,
    state,
    style,
    animate,
    transition,
} from '@angular/animations';

@Component({
    selector: 'app-albums',
    templateUrl: './albums.component.html',
    styleUrls: ['./albums.component.scss'],
    animations: [
        trigger('selectAlbum', [
            state('selected', style({
                //height: '200px',
                //opacity: 1,
                backgroundColor: 'rgb(215, 236, 135, 0.3)',
                // need to fix it textTransform: 'capitalize',
            })),
            state('noSelected', style({
                //height: '100px',
                //opacity: 0.5,
                //backgroundColor: 'green'
            })),
            transition('selected => noSelected', [
                animate('0.2s')
            ]),
            transition('noSelected => selected', [
                animate('0.2s')
            ]),
        ]),
    ],
})
export class AlbumsComponent implements OnInit {
    albums: Album[];
    faHeart = faHeart;
    faClock = faClock;
    selectedAlbum : Album;
    status: string = null; // pour gérer l'affichage des caractères [play]
    startIndex: number;

    constructor(private albumService: AlbumService) {
        // contrôle de la méthode count
        // console.log(this.albumService.count)
    }

    ngOnInit() {
        this.albums = this.albumService.paginate(0, this.albumService.paginateNumberPage());
        this.startIndex = 1
    }

    onSelect(album: Album) {
        this.selectedAlbum = album;
    }

    playParent($event) {
        this.status = $event.id; // identifiant unique
        //this.albumService.switchOn($event); // placé ailleur
    }

    paginate($event) {
        this.albums = this.albumService.paginate($event.start, $event.end);
        this.startIndex = $event.start + 1;
    }

    toDate(minutes) {
        let date = new Date(0);
        date.setMinutes(minutes);
        return date;
    }

    onSearchAlbums($event) {
        this.albums = $event;
    }
}
