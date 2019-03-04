import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from'@angular/router';
import { Album } from'../album'
import { faHeart, faClock } from '@fortawesome/free-solid-svg-icons';
import { AlbumService } from '../album.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-album-description',
  templateUrl: './album-description.component.html',
  styleUrls: ['./album-description.component.scss']
})
export class AlbumDescriptionComponent implements OnInit {
  album : Observable<Album>|Album;
  faHeart = faHeart;
  faClock = faClock;
  selectedAlbum : Album;
  status: string = null; // pour gérer l'affichage des caractères [play]

  constructor(
    private route: ActivatedRoute, // récupérez le service route
    private aS: AlbumService // récupérez le service
  ) { }

  ngOnInit() {
    // permet de récupérer l'identifiant
    const id = this.route.snapshot.paramMap.get('id');
    this.album = this.aS.getAlbum(id);
  }

  toDate(minutes) {
    let date = new Date(0);
    date.setMinutes(minutes);
    return date;
  }

  onSelect(album: Album) {
    //console.log('onSelect is executed',album);
    this.selectedAlbum = album;
  }

  playParent($event) {
    this.status = $event.id; // identifiant unique
    //console.log($event)
  }

}
