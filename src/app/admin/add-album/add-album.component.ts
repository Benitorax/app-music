import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from'@angular/forms';
import { AlbumService } from'../../album.service';
import { Router } from '@angular/router';
import { Album, List } from '../../album';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-add-album',
  templateUrl: './add-album.component.html',
  styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent implements OnInit {
    [x: string]: any;
    albumForm: FormGroup;
    selectedImage: File = null;


    constructor(
        private fb : FormBuilder, 
        private aS : AlbumService,
        private router: Router
    ) { }

    ngOnInit() {
        this.albumForm = this.fb.group({
        ref : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        name : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        title : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        description : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        duration : new FormControl('', [
            Validators.required,
            Validators.pattern('[0-9]*'),
            Validators.min(100)
        ]),
        tags : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),
        like : new FormControl('', [
            Validators.required,
            Validators.minLength(3)
        ]),

        })
    }

    get ref() {
        return this.albumForm.get('ref');
    }
    get name() {
        return this.albumForm.get('name');
    }
    get title() {
        return this.albumForm.get('title');
    }
    get description() {
        return this.albumForm.get('description');
    }
    get duration() {
        return this.albumForm.get('duration');
    }
    get tags() {
        return this.albumForm.get('tags');
    }
    get like() {
        return this.albumForm.get('like');
    }

    onSubmit() {
        let album: Album = {
        id: null,
        ref: this.albumForm.value['ref'],
        name: this.albumForm.value['name'],
        title: this.albumForm.value['title'],
        description: this.albumForm.value['description'],
        duration: parseInt(this.albumForm.value['duration']),
        status: 'off',
        url: "",
        tags: this.albumForm.value['tags'],
        like: this.albumForm.value['like'],
        };

        firebase.database().ref('albums').orderByKey().limitToLast(1).once('value', (snapshot) => {
            let randomId = parseInt(Object.keys(snapshot.val())[0]) + 1;
            album.id = randomId.toString();
            console.log(randomId);
            this.aS.addAlbum(album).subscribe(
                a => { 
                    if (this.selectedImage != null) {
                        a.name || 'anonymous';
                        this.aS.uploadFile(this.selectedImage)
                            .then(
                                snapshot => {
                                    return snapshot.ref.getDownloadURL()
                                }
                            )
                            .then(url => {
                                album.url = url;
                                this.aS.updateAlbum(randomId, album).subscribe(
                                    () => {
                                        console.log('updated with url image', album.url)
                                    }
                                );
                            }
                        )
                        .catch(error => console.log(error))
                    }
                },
                error => console.error(error),
                () => {
                    this.router.navigate(
                        ['admin'], 
                        { queryParams: { message:'success'} }
                    );
                }
            );
        });
    }

    onSelectedImage(event) {
        this.selectedImage = <File>event.target.files[0];
        console.log(this.selectedImage);
    }

    /*makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }*/
}
