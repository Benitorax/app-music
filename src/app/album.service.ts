import { Injectable } from '@angular/core';
import { Album, List } from './album';
import { ALBUMS, ALBUM_LISTS } from './mock-albums';
import { pipe, Subject, Observable, throwError } from'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from'@angular/common/http';
import { map, filter, catchError } from'rxjs/operators';
import * as _ from'lodash';
import * as firebase from 'firebase/app';

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

    deleteAlbum(id): Observable<Object>{
        const url = `${this.albumsUrl}/${id}/.json`;
        console.log('Album Url to delete', url);
        this.getAlbum(id).subscribe( a => {
            console.log('album to delete', a);
            this.deleteAlbumImage(a);
        })
        
        return this.http.delete(url, httpOptions)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    console.log(error);
                    return this.handleError(error);
                })
            );
    }

    deleteAlbumImage(a) {
        if (a.url && a.url != null) {
            console.log('urlImage to delete', a.url);
            let imageFile;
            imageFile = a.url.substring(
                a.url.lastIndexOf("images%2F") + 9, 
                a.url.lastIndexOf("?")
            );
            console.log("Before deleting image from firebase with nameFile", imageFile);
            return firebase.storage().ref('images/'+imageFile).delete();
        }
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }

    addAlbum(album: Album): Observable<any> {
        let id = album.id;
        console.log('function addAlbum called');
        return this.http.put<void>(`${this.albumsUrl}/${id}.json`, album);
    }

    getIncrementId() {
        console.log('function getIncrementId called');
        let a = firebase.database().ref('albums').orderByKey().limitToLast(1).once('value', (snapshot) => {
            console.log(Object.keys(snapshot.val())[0])
        });
    }

    uploadFile(file: File) {
        const randomId = Math.random().toString(36).substring(2);
        const ref = firebase.app().storage("gs://app-music-2204d.appspot.com").ref();
        const imagesRef = ref.child('images');

        return imagesRef.child(randomId + '.png').put(file);    
    }

    updateAlbum(ref, album: Album): Observable<void> {
        console.log(ref);
        console.log('function updateAlbum called');
        return this.http.put<void>(this.albumsUrl + `/${ref}/.json`, album);
    }

    getAlbums(): Observable<Album[]> {

        return this.http.get<Album[]>(
                this.albumsUrl +'/.json', httpOptions
            )
            .pipe(
                map(albums => {
                    let newA = [];
                    albums.forEach(album => {
                        if(album !== null) {
                            newA.push(album);
                        }
                    })
                    return newA;
                }),
                // Ordonnez les albums par ordre de durées décroissantes
                /*map(albums => {
                    let Albums: Album[] = [];
                    _.forEach(albums, (v, k) => {
                        v.id = k;
                        Albums.push(v);
                    });
                    return Albums;
                }),*/
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

    getAlbumList(id: string) {
        return this.http
            .get<List>(this.albumListsUrl + `/${id}/.json`);
    }

    getAlbumLists(): Observable<List[]> {
        return this.http
            .get<List[]>(
                this.albumListsUrl +'/.json', httpOptions
            );
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
