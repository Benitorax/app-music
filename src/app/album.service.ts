import { Injectable } from '@angular/core';
import { Album, List } from './album';
import { ALBUMS, ALBUM_LISTS } from './mock-albums';
import { Subject } from'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    private _albums: Album[] = ALBUMS;
    private _albumLists: List[] = ALBUM_LISTS;
    private _currentPage;
    // subject pour la pagination informer les autres components
    sendCurrentNumberPage = new Subject<number>();
    subjectAlbum = new Subject<Album>();

    constructor() { }

    paginate(start, end) {
        //console.log('test');
        return this.getAlbums().slice(start, end);  
    };

    getAlbums() {
        return this._albums.sort((a, b) => b.duration - a.duration );
        //return this.albums;
    }

    getAlbum(id: string) {
        return this._albums.find((elem) => elem.id === id);
    }

    getAlbumList(id: string) {
        return this._albumLists.find((elem) => elem.id === id);
    }

    getAlbumLists() {
        return this._albumLists;
    }

    count():number{
        return this._albums? this._albums.length : 0;
    }

    currentPage(page: number) {
        return this.sendCurrentNumberPage.next(page);
    }

    paginateNumberPage():number{
        if ( typeof environment.numberPage == 'undefined' )
        throw "Attention la pagination n'est pas définie" ;

        return environment.numberPage ;
    }

    switchOn(album) {
        album.status = "on";
        this.subjectAlbum.next(album);
    }
    switchOff(album) {
        album.status = "off";
        this.subjectAlbum.next(album);
    }

    search(word: string): Album[] {
        // separate terms with double quote
        let regex = /"(.*?)"/gi
        let found = word.match(regex);

        if (found) {
        found.forEach( elem => {
            word = word.replace(elem, "");
        });
        }

        // separate each element / removing space
        // put back every elements together
        let regex2 = /[.,:;\(\)\[\] ]/gi
        let words = word.split(regex2);
        if(found) {
            found.forEach(elem => {
                elem = elem.slice(1, -1);
                words.push(elem);
            });
        }

        // make the searching
        let results: Album[] = [];
        words.forEach((w) => {
        if(w.length > 0) {
            let regex = new RegExp(w, 'i');

            this._albums.forEach((album) => {
            for (let elem in album) {
                if(album[elem].toString().search(regex) > -1 && elem !== 'id') 
                {
                    if(results.indexOf(album) == -1) 
                    {
                        results.push(album);
                    }
                    break;
                }
            }
            })
        }
        })

        return results;
    }
}
