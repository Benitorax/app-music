import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from'@angular/forms'; // template-driven
import { AlbumService } from'../../album.service';
import { Album } from'../../album';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() newAlbums: EventEmitter<Album[]> = new EventEmitter();
  results;
  word;

  constructor(private albumService: AlbumService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm): void {
    // récupération des données du formulaire
    //console.log(form);
    // récupération d'une valeur spécifique
    //console.log(form.value['word']); 
    this.word = form.value['word'];
    this.results = this.albumService.search(form.value['word']);
    if(this.results!== null) {
      this.newAlbums.emit(this.results);
    }
  }
}
