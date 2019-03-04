import { Injectable } from '@angular/core';
import { Album, List } from './album';
import { ALBUMS, ALBUM_LISTS } from './mock-albums';
import { Subject, Observable } from'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from'@angular/common/http';
import { map } from'rxjs/operators';
import * as _ from'lodash';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':'application/json',
    })
};

@Injectable({
    providedIn: 'root'
})
export class AlbumService {
    // convention dans l'API ajoutez votre identifant de base de données
    private albumsUrl ='https://app-music-2204d.firebaseio.com/albums';
    private albumListsUrl ='https://app-music-2204d.firebaseio.com/albumLists';
    private _albums: Album[];// = ALBUMS;
    private _albumLists: List[];// = ALBUM_LISTS;
    private _currentPage;
    // subject pour la pagination informer les autres components
    sendCurrentNumberPage = new Subject<number>();
    subjectAlbum = new Subject<Album>();

    constructor(private http: HttpClient) {
        this.getAlbums().subscribe(
            albums => {
                this._albums = albums;
            }
        );
        this.getAlbumLists().subscribe(
            albumLists => {
                this._albumLists = albumLists;
            }
        );
    }

    paginate(start, end) {
        //return this._albums.slice(start, end);  
        return this.getAlbums().pipe(
            map(albums => albums.slice(start, end))
        );
    };

    getAlbums(): Observable<Album[]> {
        return this.http.get<Album[]>(
                this.albumsUrl +'/.json', httpOptions
            )
            .pipe(
                // Préparation des données avec _.values pour avoir un format exploitable dans l'application => Array de values JSON
                map(albums => {
                    return _.values(albums)
                }),
                // Ordonnez les albums par ordre de durées décroissantes
                map(albums => {
                    return albums.sort(
                        (a, b) => { 
                            return b.duration - a.duration 
                        }
                    );
                })
            )
    }
    
    getAlbum(id: string): Observable<Album> {
        // URL/ID/.json pour récupérer un album
        return this.http.get<Album>(
                this.albumsUrl +`/${id}/.json`
            )
            .pipe(
                map(album => album) // JSON
            );
    }

    // getAlbums() {
    //     return this._albums.sort((a, b) => b.duration - a.duration );
    //     //return this.albums;
    // }

    // getAlbum(id: string) {
    //     return this._albums.find((elem) => elem.id === id);
    // }

    getAlbumList(id: string) {
        return this._albumLists.find((elem) => elem.id === id);
    }

    getAlbumLists(): Observable<List[]> {
        return this.http
            .get<Album[]>(
                this.albumListsUrl +'/.json', httpOptions
            )
            .pipe(
                // Préparation des données avec _.values pour avoir un format exploitable dans l'application => Array de values JSON
                map(albumLists => {
                    return _.values(albumLists)
                }),
            )
    }

    count():Observable<number>{
        return this.getAlbums().pipe(
            map(album => {
                return album.length;
            }),
        );
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
        //this.subjectAlbum.next(album);
        this.http
        .put<void>(this.albumsUrl +`/${album.id}/.json`, album)
        .subscribe(
            e => e,
            error => console.warn(error),
            () => { this.subjectAlbum.next(album); }
        );
    }

    switchOff(album) {
        album.status = "off";
        //this.subjectAlbum.next(album);
        this.http
        .put<void>(this.albumsUrl +`/${album.id}/.json`, album)
        .subscribe(
            e => e,
            error => console.warn(error),
            () => { this.subjectAlbum.next(album); }
        );
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
