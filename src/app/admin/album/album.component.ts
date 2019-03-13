import { Component, OnInit, Inject } from '@angular/core';
import { AlbumService } from 'src/app/album.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
    albums;
    perPage: number = 5;
    message: string;
    count;
    startIndex: number;
    showModal: boolean = false;
    albumId;

    constructor(
        private aS: AlbumService,
        private router: Router,
    ) { 
    }

    ngOnInit() {
        this.aS.paginate(0, this.aS.paginateNumberPage())
        .subscribe(albums => {
            this.albums = albums;
            this.count = this.aS.count();
            //console.log('albums from AlbumComponent', albums);
        });
        this.startIndex = 1;
    }

    paginate($event) {
        this.aS
            .paginate($event.start, $event.end)
            .subscribe(albums => {
                this.albums = albums
            });
        this.startIndex = $event.start + 1;
    }

    onDeleteAlbum(album) {
        this.aS.deleteAlbum(album);
    }
    
    toDate(minutes) {
        let date = new Date(0);
        let hours = Math.floor(minutes/60);
        minutes = minutes - hours*60
        date.setHours(hours);
        date.setMinutes(minutes)
        return date;
    }

    destroy(id: number) {
        // routerLink="/admin/delete/{{album.id}}/deleted"
        this.showModal = true;
        this.albumId = id;
    }

    /*choice($event) {
        this.showModal = $event.showModal;
    }*/


    yes() {
        this.showModal = false;
        this.router.navigate(
            [
                '/admin/album/delete/' + this.albumId + '/deleted'
            ], { queryParams: { message: 'Success' } }
        );
    }

    no() {
        this.showModal = false;
    }
}

